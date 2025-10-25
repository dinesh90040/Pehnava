# Pehenava (Ethnic Wear) — Project Guide and Next.js Migration

A modern web application for a luxury ethnic wear brand. The current stack is a Vite + React frontend with TailwindCSS and an Express + MongoDB backend. This README explains how to run the existing project and provides a complete plan to recreate it using Next.js.


## Stack (Current Project)
- **Frontend**: React 18, Vite, TailwindCSS, Radix UI primitives, lucide-react icons, framer-motion, react-router-dom, Leaflet (via react-leaflet), EmailJS
- **Backend**: Node.js, Express, MongoDB (native driver), Nodemailer
- **Dev tooling**: Vite proxy for API, Tailwind plugins, ESLint, PostCSS


## Repository Structure (Key Paths)
- `Pehnava/` — app root
  - `src/` — React source (components, pages, hooks, contexts, data)
  - `public/` — static assets
  - `server/` — Express API server
    - `src/index.js` — server entry (routes mounted here)
    - `src/routes/` — routers: `auth`, `applications`, `markets`, `shops`, `products`, `cart`, `orders`, `reviews`, `wishlist`, `addresses`, `notifications`, `coupons`
  - `env.example` — frontend env template
  - `server/env.example` — backend env template
  - `vite.config.js` — Vite + dev proxy for `/api` → `http://localhost:5000`
  - `tailwind.config.js` — Tailwind setup


## Environment Variables

Copy templates and fill values:
- **Frontend**: `Pehnava/env.example` → create `Pehnava/.env.local`
  - `VITE_APP_URL`
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_SERVICE_ROLE_KEY` (optional)
  - `VITE_STRIPE_PUBLISHABLE_KEY` (optional)
  - `VITE_GOOGLE_MAPS_API_KEY` (for maps)
  - `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` (optional)

- **Backend**: `Pehnava/server/env.example` → create `Pehnava/server/.env`
  - `PORT` (default 5000)
  - `MONGODB_URI` (e.g., `mongodb://127.0.0.1:27017/pehenava`)
  - `MONGODB_DB_NAME`
  - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `ADMIN_EMAIL`
  - `JWT_SECRET`


## Install & Run (Current Project)
- Prereqs: Node 18+, MongoDB running locally or a cloud URI

1) Install root and app deps
```bash
# root (mongo helper only)
npm i

# app + frontend
cd Pehnava
npm i

# backend
cd server
npm i
```

2) Seed optional data
- The server bootstraps markets/shops from `Pehnava/src/data/markets.json` if empty on first run.
- Additional seeds exist:
```bash
# from Pehnava/
npm run seed:mongo    # runs tools/seed-mongodb.js (if configured)

# from Pehnava/server/
npm run seed:comprehensive
```

3) Start development servers
```bash
# terminal A — backend
cd Pehnava/server
npm run dev   # nodemon, listens on http://localhost:5000

# terminal B — frontend
cd Pehnava
npm run dev   # Vite dev server on http://localhost:5173 (proxies /api → 5000)
```

4) Production build (frontend)
```bash
cd Pehnava
npm run build
npm run preview
```


## API Overview (Express)
Base URL (dev): `http://localhost:5000`
- `GET /api/health` — status info
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `POST /api/applications`
- `GET /api/markets`
- `GET /api/shops`
- `GET /api/products`
- `GET /api/cart/:userId`
- Other mounted routers: `orders`, `reviews`, `wishlist`, `addresses`, `notifications`, `coupons`

Note: See `Pehnava/server/src/routes/*` for full details.


## Frontend Notes
- Routing: React Router (`react-router-dom`)
- Styling: TailwindCSS (`tailwindcss-animate` plugin), custom colors (`maroon`, `gold`, `cream`) and CSS variables
- UI: Radix primitives, lucide-react icons, framer-motion animations
- Maps: Leaflet via `react-leaflet` (requires `VITE_GOOGLE_MAPS_API_KEY` if relevant to your usage)
- Dev proxy: Vite proxies `/api` calls to the Express server


# Rebuilding This Project with Next.js (Recommended)

You can migrate either progressively (keep the Express API) or fully (move API into Next.js Route Handlers). Below is a clear plan using Next.js 14+ (App Router).

## Option A — Keep Express API, Migrate Frontend Only
- Pros: Faster, minimal changes to API
- Cons: Two deployables (Next.js app + API)

Steps:
1) Create Next.js app
```bash
npx create-next-app@latest pehnava-next \
  --typescript \
  --eslint \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"
```

2) Install UI deps used in React app
```bash
cd pehnava-next
npm i framer-motion lucide-react @radix-ui/react-avatar @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-slider \
  @radix-ui/react-tabs @radix-ui/react-toast clsx class-variance-authority \
  tailwind-merge tailwindcss-animate leaflet react-leaflet emailjs-com
```

3) Configure Tailwind (extend config similar to current)
- Merge colors and animations from `Pehnava/tailwind.config.js`
- Add `tailwindcss-animate` plugin

4) Proxy API in Next.js (development)
- Add rewrite to `next.config.js` so `/api` goes to `http://localhost:5000`
```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'http://localhost:5000/api/:path*' },
    ];
  },
};
module.exports = nextConfig;
```

5) Port pages and components
- Map React Router routes to Next.js folders in `app/`:
  - `app/(public)/page.tsx` → home
  - `app/markets/page.tsx`, `app/shops/page.tsx`, `app/products/page.tsx`
  - dynamic routes: `app/products/[id]/page.tsx`, etc.
- Replace `react-router-dom` navigation with Next.js `Link` and `useRouter`

6) Client vs Server Components
- Mark Leaflet maps and animation-heavy components as Client Components by adding `'use client'` at the top
- Use `next/dynamic` for Leaflet to avoid SSR issues:
```tsx
'use client'
import dynamic from 'next/dynamic'
const Map = dynamic(() => import('./YourMapComponent'), { ssr: false })
```

7) Environment variables
- Move `VITE_*` to Next.js naming:
  - Public: `NEXT_PUBLIC_*` (e.g., `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`)
  - Server-only secrets: no `NEXT_PUBLIC_` prefix
- Create `.env.local`

8) Test against existing Express API
- Confirm routes like `/api/health`, `/api/products` work via rewrites

9) Deployment
- Deploy Next.js to Vercel
- Deploy Express API to Render/Fly/ Railway/Heroku or a server/VM. Update Vercel env `NEXT_PUBLIC_API_BASE_URL` (or keep rewrites)


## Option B — Full Migration: Move API into Next.js
- Pros: Single deployable, edge/runtime options
- Cons: Some refactor of Express routes

Steps:
1) Create Next.js app (same as Option A)

2) Add MongoDB
```bash
npm i mongodb
```
- Create a shared DB util `src/lib/db.ts`:
```ts
import { MongoClient } from 'mongodb'
const uri = process.env.MONGODB_URI as string
const dbName = process.env.MONGODB_DB_NAME as string
let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!global._mongoClientPromise) {
  client = new MongoClient(uri)
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

export async function getDb() {
  const c = await clientPromise
  return c.db(dbName)
}
declare global { var _mongoClientPromise: Promise<MongoClient> | undefined }
```

3) Recreate API routes as Route Handlers
- Example: `app/api/health/route.ts`
```ts
import { NextResponse } from 'next/server'
export function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
}
```
- Example: `app/api/products/route.ts` (convert from Express handler logic)
```ts
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
export async function GET() {
  const db = await getDb()
  const products = await db.collection('products').find({}).toArray()
  return NextResponse.json(products)
}
```
- Repeat for `auth`, `applications`, `markets`, `shops`, `cart`, `orders`, `reviews`, `wishlist`, `addresses`, `notifications`, `coupons`

4) Port seed/bootstrap logic
- On first run or via a script, load `markets.json` into `markets` and `shops` collections (similar to `bootstrapIfNeeded` in Express)
- You can create a one-off script under `scripts/seed.ts` run with `ts-node` locally

5) Email (OTP/notifications)
- Use `nodemailer` in Route Handlers (Node runtime) or switch to a provider (e.g., Resend, SendGrid)

6) Auth considerations
- If you expand from OTP to sessions/JWT:
  - Implement `httpOnly` cookies in Route Handlers
  - Store sessions in MongoDB if needed

7) Update frontend fetches to call Next.js API (`/api/...`)

8) Deployment
- Single deploy to Vercel
- Set `MONGODB_URI`, `MONGODB_DB_NAME`, email creds, and JWT secret in Vercel Project Settings


## Feature Parity Checklist
- **Markets & Shops**: lists, detail pages, and bootstrap data
- **Products**: catalog and detail
- **Cart**: per-user cart endpoints and UI
- **Orders**: placement and history
- **Wishlist**: per-user storage
- **Reviews**: CRUD
- **Auth (OTP)**: request/verify endpoints and client UI
- **Addresses & Notifications & Coupons**: CRUD and UI
- **Map**: Leaflet map rendering with dynamic import (no SSR)


## Suggested Next.js App Structure
```
app/
  layout.tsx
  page.tsx
  markets/
    page.tsx
  shops/
    page.tsx
  products/
    page.tsx
    [id]/page.tsx
  cart/
    page.tsx
  wishlist/
    page.tsx
  orders/
    page.tsx
  api/
    health/route.ts
    products/route.ts
    ... (others)
src/
  components/
  hooks/
  lib/db.ts
  styles/
public/
```


## Data and Bootstrap Notes
- The Express server bootstraps `markets` and `shops` from `Pehnava/src/data/markets.json` when empty. Replicate this in Next.js with a one-off seed.
- Consider adding indexes in MongoDB for query performance (e.g., `products.id`, `shops.marketId`, etc.)


## Development Tips
- Use Client Components only where necessary (forms, maps, animations). Prefer Server Components for data fetching pages (faster, smaller bundles)
- For Leaflet, always dynamic import and guard on `window`
- Centralize fetch base URL using `process.env.NEXT_PUBLIC_API_BASE_URL` if you keep an external API


## License
Private/internal project. Adapt as needed.
