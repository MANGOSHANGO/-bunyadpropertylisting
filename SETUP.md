# BUNYAD MVP - Quick Start Guide

## ✅ What's Built

### ✨ Frontend (React + Vite + TailwindCSS)
- [x] Home page with hero search bar and city quick-links
- [x] Property search page with filters (city, category, price range, purpose)
- [x] Property detail page with image gallery
- [x] User authentication (sign up, sign in)
- [x] Beautiful user dashboard with:
  - My Listings (table view)
  - Add Property (4-step multi-form)
  - Profile settings
- [x] Responsive design with Terracotta & Cream color scheme
- [x] TailwindCSS styling with Plus Jakarta Sans font
- [x] Fully typed TypeScript components
- [x] React Router v7 navigation
- [x] Zustand for auth state management
- [x] React Query for data fetching
- [x] Axios with JWT token refresh

### 🔧 Backend (Node.js + Express + PostgreSQL)
- [x] Express server with CORS & security headers
- [x] User authentication (register, login, refresh token)
- [x] Property CRUD operations with ownership validation
- [x] Advanced search with filters & pagination
- [x] AWS S3 integration with presigned URLs for image upload
- [x] PostgreSQL database schema with proper indexes
- [x] Zod validation for all requests
- [x] JWT middleware for protected routes
- [x] Error handling middleware

## 🚀 Quick Start

### Step 1: Configure Backend

1. Go to `backend/` folder
2. Update `.env` with your credentials:

```env
DATABASE_URL=postgresql://username:password@your-db-host:5432/bunyad
JWT_SECRET=your-super-secret-key-change-this
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
S3_BUCKET=your-s3-bucket-name
```

3. Create PostgreSQL database and run:
```bash
psql -U your_user -d bunyad < db-init.sql
```

4. Start backend:
```bash
cd backend
npm run dev
```

### Step 2: Run Frontend

```bash
cd frontend
npm run dev
```

## 📋 Database Setup

The `db-init.sql` file creates:
- `users` table with email unique constraint
- `properties` table with category, type, purpose filters
- `property_images` table for S3 image storage
- `refresh_tokens` table for JWT refresh
- All necessary indexes for performance

## 🎨 Color Scheme

The platform uses a warm, welcoming Pakistani aesthetic:

```
Primary (Terracotta):  #C85C3A  ← Main CTA buttons, borders
Accent (Warm Cream):   #E8D5B0  ← Highlights, hover states
Background (Off-white): #FDF8F3  ← Main background
Text (Dark Charcoal):   #2D2D2D  ← All body text
```

All applied with TailwindCSS and custom component classes (btn-primary, btn-secondary, card, input-field).

## 📝 File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          ← Navigation with auth links
│   │   ├── Footer.tsx          ← Footer with links
│   │   └── PropertyCard.tsx    ← Reusable property card
│   ├── pages/
│   │   ├── HomePage.tsx        ← Hero + featured properties
│   │   ├── SearchPage.tsx      ← Search with filters
│   │   ├── PropertyDetailPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── dashboard/
│   │       ├── DashboardLayout.tsx
│   │       ├── MyListingsPage.tsx
│   │       ├── AddPropertyPage.tsx
│   │       └── ProfilePage.tsx
│   ├── api/client.ts           ← Axios instance with JWT refresh
│   ├── store/auth.ts           ← Zustand auth store
│   ├── types/index.ts          ← TypeScript interfaces
│   ├── App.tsx                 ← Router setup
│   ├── main.tsx
│   └── index.css               ← TailwindCSS + custom components
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js

backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts            ← Register, login, refresh
│   │   ├── properties.ts      ← CRUD + search + filters
│   │   └── upload.ts          ← S3 presigned URLs
│   ├── middleware/
│   │   ├── auth.ts            ← JWT verification
│   │   └── validate.ts        ← Zod validation
│   ├── services/
│   │   ├── db.ts              ← PostgreSQL pool
│   │   └── s3.ts              ← AWS S3 operations
│   ├── utils/jwt.ts           ← Token generation/verification
│   ├── types/index.ts
│   └── index.ts               ← Express server
├── db-init.sql                ← Database initialization
├── tsconfig.json
├── .env.example
└── .env (create and fill)
```

## 🔐 Authentication Flow

1. User signs up/logs in
2. Backend returns `accessToken` (1 hour) + `refreshToken` (7 days)
3. Frontend stores in localStorage and auth store
4. Each API request includes `Authorization: Bearer <token>`
5. When token expires, axios auto-refreshes using refreshToken
6. If refresh fails, user redirected to login

## 📲 Property Upload Flow

1. User selects images from computer
2. Frontend requests presigned S3 URL from backend
3. Frontend uploads directly to S3 using presigned URL
4. Frontend confirms upload, backend saves URL to database
5. Images immediately appear in property gallery

## 🎯 MVP Features Completed

✅ Beautiful home page with search  
✅ Advanced property search & filtering  
✅ User registration & authentication  
✅ User dashboard for managing properties  
✅ Multi-step property creation form  
✅ S3 image upload with presigned URLs  
✅ JWT token refresh mechanism  
✅ Responsive mobile design  
✅ Professional color scheme  
✅ All TypeScript with full type safety  

## 🚀 Next Steps for Production

1. **Deploy Database**: Set up PostgreSQL on Railway
2. **Deploy Backend**: Push to Railway, configure env vars
3. **Deploy Frontend**: Deploy to Vercel, update API_URL
4. **S3 Setup**: Create bucket, configure CORS policy
5. **Email Verification**: Add nodemailer for signup emails
6. **Phone OTP**: Add Twilio for phone verification
7. **Payment**: Add stripe for premium listings
8. **Analytics**: Add google analytics

## 📞 Support

For issues or questions, check:
- Backend logs: `npm run dev` in backend folder
- Browser console: Check Network tab for API errors
- Database: Verify tables exist with `\dt` in psql
- S3: Check bucket policy and CORS settings

Happy building! 🎉
