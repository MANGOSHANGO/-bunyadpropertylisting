# BUNYAD - Free Property Listing Platform in Pakistan

A beautiful, modern property listing platform built with React, Node.js, and PostgreSQL.

## Project Structure

```
bunyad/
├── frontend/          # React + Vite + TailwindCSS
├── backend/           # Node.js + Express + PostgreSQL
└── README.md
```

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: TailwindCSS 4
- **State**: Zustand
- **HTTP**: Axios
- **UI Icons**: Lucide React
- **Routing**: React Router v7
- **Data Fetching**: TanStack React Query

### Backend
- **Framework**: Node.js + Express
- **Language**: TypeScript
- **Database**: PostgreSQL + PgBouncer (connection pooling)
- **Storage**: AWS S3
- **Auth**: JWT (access + refresh tokens)
- **Password**: bcryptjs
- **Validation**: Zod

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database
- AWS S3 bucket and credentials
- Railway account (for hosting database and backend)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file and configure
cp .env.example .env

# Update .env with:
# - DATABASE_URL: your PostgreSQL connection string
# - JWT_SECRET: a secure random string
# - AWS credentials and S3 bucket details

# Initialize database
# Run db-init.sql in your PostgreSQL client

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create/update .env if needed
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Features

### Home Page
- Hero section with search bar
- City quick-links (Karachi, Lahore, Islamabad, etc.)
- Featured properties grid
- Beautiful terracotta & cream color scheme

### Property Search
- Filter by city, category, purpose, price range
- Pagination with 12 properties per page
- Responsive grid layout

### Property Details
- Image gallery with zoom support
- Key property details (bedrooms, bathrooms, area)
- Property description
- Contact agent button

### User Authentication
- Sign up with name, email, password
- Email + password login
- JWT-based authentication
- Auto token refresh

### User Dashboard
- **My Listings**: View all your properties in a table
- **Add Property**: Multi-step form to list a property
  - Step 1: Category & Type selection
  - Step 2: Location details
  - Step 3: Property details & pricing
  - Step 4: Image upload to S3
- **Profile**: Update name, phone, change password

## Color Scheme

- **Primary**: #C85C3A (Terracotta)
- **Accent**: #E8D5B0 (Warm Cream)
- **Background**: #FDF8F3 (Off-white)
- **Text**: #2D2D2D (Dark Charcoal)
- **Font**: Plus Jakarta Sans (light 300, medium 500, semibold 600)

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token

### Properties
- `GET /api/properties` - List properties with filtering & pagination
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (auth required)
- `PUT /api/properties/:id` - Update property (owner required)
- `DELETE /api/properties/:id` - Delete property (owner required)

### Upload
- `POST /api/upload/presigned` - Get S3 presigned URL
- `POST /api/upload/confirm` - Confirm image upload
- `DELETE /api/upload/:key` - Delete image from S3

## Database Schema

### users
- id (UUID)
- name, email, password_hash, phone
- is_verified, created_at, updated_at

### properties
- id, user_id (FK)
- title, description, category, type, purpose
- price, area, area_unit
- bedrooms, bathrooms
- city, area_name, address
- latitude, longitude
- is_active, created_at, updated_at

### property_images
- id, property_id (FK)
- s3_key, s3_url
- is_primary, sort_order
- created_at

### refresh_tokens
- id, user_id (FK)
- token, expires_at, created_at

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Backend (Railway)
```bash
npm run build
# Configure environment variables on Railway
# Add start script: node dist/index.js
```

## Future Enhancements

- [ ] Map integration for property location
- [ ] Advanced search with map view
- [ ] Property favorites/wishlist
- [ ] Agent ratings and reviews
- [ ] Messaging between buyers and sellers
- [ ] Mobile app (React Native)
- [ ] Payment integration for premium listings
- [ ] SMS notifications
- [ ] Video property tours

## License

MIT
