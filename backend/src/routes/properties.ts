import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../services/db';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

const propertySchema = z.object({
  title: z.string().min(5),
  description: z.string().optional(),
  category: z.enum(['residential', 'commercial', 'plot', 'agricultural']),
  type: z.string().min(2),
  purpose: z.enum(['buy', 'rent']),
  price: z.number().positive(),
  area: z.number().positive().optional(),
  area_unit: z.string().default('marla'),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  city: z.string().min(2),
  area_name: z.string().optional(),
  address: z.string().optional(),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { city, category, type, purpose, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    let sql = 'SELECT * FROM properties WHERE is_active = true';
    const params: unknown[] = [];
    let paramIndex = 1;

    if (city) {
      sql += ` AND city ILIKE $${paramIndex}`;
      params.push(`%${city}%`);
      paramIndex++;
    }
    if (category) {
      sql += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    if (type) {
      sql += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }
    if (purpose) {
      sql += ` AND purpose = $${paramIndex}`;
      params.push(purpose);
      paramIndex++;
    }
    if (minPrice) {
      sql += ` AND price >= $${paramIndex}`;
      params.push(Number(minPrice));
      paramIndex++;
    }
    if (maxPrice) {
      sql += ` AND price <= $${paramIndex}`;
      params.push(Number(maxPrice));
      paramIndex++;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    const offset = (Number(page) - 1) * Number(limit);
    params.push(limit, offset);

    const result = await query(sql, params);
    const countResult = await query(
      `SELECT COUNT(*) FROM properties WHERE is_active = true ${
        params.length > 2 ? `AND city ILIKE $1` : ''
      }`,
      city ? [`%${city}%`] : []
    );

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      properties: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT p.*, json_agg(json_build_object('id', pi.id, 's3_url', pi.s3_url, 'is_primary', pi.is_primary)) as images
       FROM properties p
       LEFT JOIN property_images pi ON p.id = pi.property_id
       WHERE p.id = $1
       GROUP BY p.id`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

router.post('/', authMiddleware, validate(propertySchema), async (req: Request, res: Response) => {
  try {
    const { title, description, category, type, purpose, price, area, area_unit, bedrooms, bathrooms, city, area_name, address } = req.body;

    const result = await query(
      `INSERT INTO properties (user_id, title, description, category, type, purpose, price, area, area_unit, bedrooms, bathrooms, city, area_name, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [req.user!.userId, title, description, category, type, purpose, price, area, area_unit, bedrooms, bathrooms, city, area_name, address]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

router.put('/:id', authMiddleware, validate(propertySchema), async (req: Request, res: Response) => {
  try {
    const { title, description, category, type, purpose, price, area, area_unit, bedrooms, bathrooms, city, area_name, address } = req.body;

    const ownerCheck = await query('SELECT user_id FROM properties WHERE id = $1', [req.params.id]);
    if (ownerCheck.rows.length === 0 || ownerCheck.rows[0].user_id !== req.user!.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await query(
      `UPDATE properties SET title = $1, description = $2, category = $3, type = $4, purpose = $5, price = $6, area = $7, area_unit = $8, bedrooms = $9, bathrooms = $10, city = $11, area_name = $12, address = $13, updated_at = NOW()
       WHERE id = $14
       RETURNING *`,
      [title, description, category, type, purpose, price, area, area_unit, bedrooms, bathrooms, city, area_name, address, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const ownerCheck = await query('SELECT user_id FROM properties WHERE id = $1', [req.params.id]);
    if (ownerCheck.rows.length === 0 || ownerCheck.rows[0].user_id !== req.user!.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await query('DELETE FROM properties WHERE id = $1', [req.params.id]);
    res.json({ message: 'Property deleted' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

export default router;
