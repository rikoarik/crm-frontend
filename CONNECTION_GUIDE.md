# Frontend-Backend Connection Guide

## Setup

### 1. Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     PORT=3001
     CORS_ORIGIN=http://localhost:3000
     ```

3. **Run database migrations:**
   - Execute SQL from `backend/src/database/migrations.sql` in your Supabase SQL editor

4. **Start backend:**
   ```bash
   npm run dev
   ```
   Backend akan berjalan di `http://localhost:3001`

### 2. Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables (optional):**
   - Copy `.env.example` to `.env.local`
   - Set API URL jika berbeda:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:3001/api
     ```
   - Default: `http://localhost:3001/api`

3. **Start frontend:**
   ```bash
   npm run dev
   ```
   Frontend akan berjalan di `http://localhost:3000`

## Connection Verification

### Check Backend
- Backend API: `http://localhost:3001/api`
- Health check: `http://localhost:3001/api/auth/login` (POST)

### Check Frontend
- Frontend: `http://localhost:3000`
- API calls akan otomatis ke: `http://localhost:3001/api`

## Authentication Flow

1. **Login:**
   - Frontend: `POST /api/auth/login` dengan `{ username, password }`
   - Backend: Validasi user, return user data dengan role & province
   - Frontend: Simpan username di localStorage

2. **Authenticated Requests:**
   - Frontend: Set header `x-username: <username>` di setiap request
   - Backend: Guard akan validate user dari header `x-username`

3. **Get Current User:**
   - Frontend: `GET /api/auth/me`
   - Backend: Return user data berdasarkan username dari header

## Troubleshooting

### CORS Error
- Pastikan `CORS_ORIGIN` di backend `.env` sesuai dengan frontend URL
- Default: `http://localhost:3000`

### 401 Unauthorized
- Pastikan user sudah login
- Check apakah username tersimpan di localStorage
- Pastikan user `is_active = true` di database

### Connection Refused
- Pastikan backend sudah running di port 3001
- Check apakah `NEXT_PUBLIC_API_URL` di frontend sesuai dengan backend URL

### Port Conflicts
- Backend: Ubah `PORT` di `.env`
- Frontend: Ubah `NEXT_PUBLIC_API_URL` di `.env.local`
- Update `CORS_ORIGIN` di backend sesuai frontend URL

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Users (Superadmin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/province` - Assign province

### Provinces (Superadmin only)
- `GET /api/provinces` - Get all provinces
- `POST /api/provinces/seed` - Seed provinces

### Leads (Admin & Superadmin)
- `GET /api/leads` - Get leads (filtered by province for admin)
- `POST /api/leads` - Create lead
- `PATCH /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Analytics (Admin & Superadmin)
- `GET /api/analytics/cities` - City distribution
- `GET /api/analytics/categories` - Category distribution
- `GET /api/analytics/status` - Status distribution
- `GET /api/analytics/funnel` - Conversion funnel

