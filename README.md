# movie-reservation

A full-stack movie ticket booking application: a **user-facing booking app** (React + Vite) and an **admin panel** (React + Vite), both powered by one **Node.js + Express + Prisma (SQLite)** API.

## Features

- Live movie catalog (posters, genres, ratings) fetched from the API
- Per-movie showtime selection (theater, screen, time, price)
- Dynamic seat map generated from the screen layout
- Interactive seat states (Available, Selected, Held, Reserved)
- 10-minute seat hold with a server-synced countdown timer
- Real seat conflict detection and hold expiry
- Order summary with live pricing
- Payment page (simulated) that creates a real confirmed booking
- Booking confirmation with a real booking reference
- My Bookings (confirmed + held, cancel held bookings)
- Authentication: register + login (JWT), protected routes, profile

## Tech Stack

- **User frontend** (`src/`): React.js, React Router, Context API, CSS3, Vite, axios
- **Admin frontend** (`frontend/`): React.js, React Router, Context API, Recharts, Vite, axios
- **Backend** (`backend/`): Node.js, Express, Prisma, SQLite, JWT, bcryptjs, zod

## Getting Started

### Prerequisites

- Node.js 18+
- (Optional) MySQL — no longer required; the app uses SQLite

### 1. Install dependencies

```bash
npm install                # user frontend (root)
cd backend && npm install  # API
cd ../frontend && npm install  # admin frontend
```

### 2. Prepare the database

```bash
cd backend
cp schema.sqlite.prisma prisma/schema.prisma   # or: node toggle-db.js sqlite
npx prisma db push
npm run seed              # seeds admins, users, movies, theaters, screens, showtimes, bookings
```

Seed accounts:
- Admin: `admin1@cinema.com` / `admin123`
- User:  `alice@gmail.com` / `user123`

### 3. Run the API (port 5000)

```bash
cd backend && npm run dev
```

### 4. Run the frontends

```bash
# User booking app (http://localhost:5173)
npm run dev

# Admin panel (http://localhost:5174)
cd frontend && npm run dev -- --port 5174
```

### Build for production

```bash
npm run build          # user app
cd frontend && npm run build   # admin app
```

## API Overview (`backend/src/index.js`)

- Public: `GET /api/movies`, `GET /api/movies/:id/showtimes`, `GET /api/showtimes`, `GET /api/showtimes/:id/seats`
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- User (JWT): `GET /api/me`, `GET /api/my/bookings`, `POST /api/showtimes/:id/hold`, `POST /api/bookings/:id/confirm`, `DELETE /api/bookings/:id`
- Admin (JWT + role): `GET|POST|PUT|DELETE /api/admin/*`

## Project Structure

- `src/` — user-facing booking frontend
- `frontend/` — admin panel frontend
- `backend/` — Express + Prisma API (SQLite), controllers, middleware, seed
