import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getPresignedUploadUrl, deleteFromS3, generateS3Key, getS3Url } from '../services/s3';
import { query } from '../services/db';

const router = Router();

router.post('/presigned', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { propertyId, filename, contentType } = req.body;

    if (!propertyId || !filename || !contentType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const s3Key = generateS3Key(req.user!.userId, propertyId, filename);
    const presignedUrl = await getPresignedUploadUrl(s3Key, contentType);

    res.json({ presignedUrl, s3Key, s3Url: getS3Url(s3Key) });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

router.post('/confirm', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { propertyId, s3Key, s3Url, isPrimary } = req.body;

    const result = await query(
      `INSERT INTO property_images (property_id, s3_key, s3_url, is_primary)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [propertyId, s3Key, s3Url, isPrimary || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error confirming upload:', error);
    res.status(500).json({ error: 'Failed to confirm upload' });
  }
});

router.delete('/:key', authMiddleware, async (req: Request, res: Response) => {
  try {
    const key = req.params.key as string;

    await deleteFromS3(key);
    await query('DELETE FROM property_images WHERE s3_key = $1', [key]);

    res.json({ message: 'Image deleted' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
