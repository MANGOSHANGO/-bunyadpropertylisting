export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: 'residential' | 'commercial' | 'plot' | 'agricultural';
  type: string;
  purpose: 'buy' | 'rent';
  price: number;
  area: number | null;
  area_unit: string;
  bedrooms: number | null;
  bathrooms: number | null;
  city: string;
  area_name: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  s3_key: string;
  s3_url: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  name: string;
  phone?: string;
}
