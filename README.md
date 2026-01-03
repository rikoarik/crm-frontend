# CRM Frontend

Frontend aplikasi CRM menggunakan Next.js 16 dengan TypeScript.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```

3. Update `.env.local` dengan backend API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Run development server:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## Struktur Project

```
frontend/
├── app/              # Next.js App Router
│   ├── page.tsx     # Dashboard
│   ├── leads/       # Leads management
│   ├── analytics/   # Analytics page
│   └── layout.tsx   # Root layout
├── components/      # React components
│   ├── ui/         # shadcn/ui components
│   ├── layout/     # Layout components
│   └── leads/      # Lead-related components
├── lib/            # Utilities
│   ├── api/        # API client
│   ├── types.ts    # TypeScript types
│   └── utils.ts    # Helper functions
└── public/         # Static files
```

## Features

- ✅ Dashboard dengan statistik
- ✅ Leads management (table & kanban view)
- ✅ Analytics dengan charts
- ✅ API client untuk komunikasi dengan backend
- ✅ Responsive design
- ✅ Dark mode support

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts (untuk analytics)
- TanStack Table (untuk data table)

