# ExpenseTracker

A full-stack expense tracking application.

## Overview

- Frontend (Client): Vite + React + Tailwind CSS
- Backend (Server): Node.js + Express + MongoDB (Mongoose)

## Repo Structure

- Frontend (Client): `client/`
- Backend (Server): `server/`

## Features

- Authentication (JWT) and protected routes
- Transactions CRUD with pagination and filtering
- Budgets (monthly and per-category) with progress tracking
- Analytics with charts (Recharts)
- Responsive UI, dark mode

## Getting Started

### Prerequisites

- Node.js 18+
- npm/pnpm/yarn
- MongoDB instance (local or cloud)

---

## Backend (Server)
Path: `server/` (Backend)

1) Environment variables
- Copy `server/env.example.txt` → `server/.env`
- Fill values:
  - `PORT=5000`
  - `MONGO_URI=mongodb://localhost:27017/expense_tracker` (or Atlas URI)
  - `JWT_SECRET=your_secret`
  - `CLIENT_URLS=http://localhost:5173` (comma-separated; add your production origins)

2) Install & run
```bash
cd server
npm install
npm run start
# or during development
npm run dev
```

3) Health check
- GET `http://localhost:5000/health` → returns `{ status, db, uptime }`

API base path: `/api`
- Auth: `/api/auth` (POST `/register`, POST `/login`)
- Transactions: `/api/transactions`
- Budget: `/api/budget`
- Analytics: `/api/analytics`

CORS
- Dynamic allow-list via `CLIENT_URLS`/`CLIENT_URL`
- Preflight handled for `/` and `/api/*`

---

## Frontend (Client)
Path: `client/` (Frontend)

1) Environment variables
- Copy `client/env.example.txt` → `client/.env` (or `.env.local`)
- Set: `VITE_API_URL=http://localhost:5000` (no trailing `/api`)

2) Install & run
```bash
cd client
npm install
npm run dev
```

3) Access app
- Open `http://localhost:5173`

Build
```bash
cd client
npm run build
npm run preview
```

---

## Deployment

Backend (Server)
- Deploy to Render/Railway/etc.
- Example public origin: `https://your-backend.onrender.com`
- Set `CLIENT_URLS` to include your frontend origins (e.g., Vercel domain)

Frontend (Client)
- Deploy to Vercel/Netlify/etc.
- Set `VITE_API_URL` to your backend origin (without `/api`) — the app appends `/api` automatically.

---

## Demo Credentials
- Email: `sample@gmail.com`
- Password: `sample`

---

## Scripts

Backend (server/package.json)
- `start`: run server
- `dev`: run with nodemon

Frontend (client/package.json)
- `dev`: start Vite dev server
- `build`: production build
- `preview`: preview built app

---

## Notes
- Ensure your `MONGO_URI` is reachable from the server environment.
- Charts are responsive; mobile can scroll horizontally where needed.
- If you see 404s from the client, confirm `VITE_API_URL` and that requests target `/api` via Axios baseURL.

## License
MIT
