# Movie Reservation — User & Admin Workflow

This document explains how the **Movie Reservation System** works end-to-end: the data model, the user (booking) flow, the admin (management) flow, and how the pieces talk to each other.

---

## 1. Project Overview

The project has **two frontends** and **one backend API**:

```
┌─────────────────────────┐     ┌─────────────────────────┐
│   USER BOOKING APP      │     │   ADMIN PANEL           │
│   (React + Vite)        │     │   (React + Vite)        │
│   folder: src/          │     │   folder: frontend/     │
│   URL:   localhost:5173 │     │   URL:   localhost:5174 │
└───────────┬─────────────┘     └────────────┬────────────┘
            │ HTTP / JSON                    │ HTTP / JSON
            ▼                                ▼
      ┌────────────────────────────────────────────┐
      │            EXPRESS + PRISMA API            │
      │            backend/src/index.js            │
      │            URL:   localhost:5000           │
      │            DB:    SQLite (backend/prisma/  │
      │                   dev.db)                  │
      └────────────────────────────────────────────┘
```

| Component | Where | Port |
|---|---|---|
| User booking app | `src/` | 5173 |
| Admin panel | `frontend/` | 5174 |
| API (Express + Prisma) | `backend/` | 5000 |
| Database | `backend/prisma/dev.db` (SQLite) | — |

> **Key idea:** both frontends talk to the **same** API and the **same** database. A booking made by a user immediately shows up in the admin panel, and movies/showtimes created by an admin immediately appear for users.

---

## 2. How to Run Everything

```bash
# 1) API (port 5000)
cd backend && npm run dev

# 2) User booking app (port 5173) — from the repo root
npm run dev

# 3) Admin panel (port 5174) — separate terminal
cd frontend && npm run dev -- --port 5174
```

**Seed accounts (created by `backend/prisma/seed.js`):**

| Role | Email | Password |
|---|---|---|
| Admin | `admin1@cinema.com` | `admin123` |
| Admin | `admin2@cinema.com` | `admin123` |
| User | `alice@gmail.com` | `user123` |
| User | `bob@yahoo.com` | `user123` |

> If showtimes look empty, re-seed for fresh dates:
> `cd backend && npm run seed`

---

## 3. Data Model

```
User ─────┬──< Booking ────< BookingSeat   (one seat label per row, e.g. "A1")
          │                │
          │                └──< Showtime ──┬──< Movie
          │                               └──< Screen ──< Theater
```

| Model | Purpose | Key fields |
|---|---|---|
| `User` | Person with an account | `name`, `email` (unique), `passwordHash`, `role` (`user` / `admin`) |
| `Movie` | A film | `title`, `genre`, `durationMinutes`, `rating`, `posterUrl`, `description` |
| `Theater` | A cinema venue | `name`, `location` |
| `Screen` | A hall inside a theater | `name`, `rows`, `columns` (defines the seat grid) |
| `Showtime` | A screening of a movie on a screen at a time | `movieId`, `screenId`, `startTime`, `price` |
| `Booking` | One purchase/hold | `userId`, `showtimeId`, `totalCost`, `status` |
| `BookingSeat` | One reserved seat within a booking | `bookingId`, `seatLabel` (e.g. `"C4"`) |

### Booking statuses

| Status | Meaning |
|---|---|
| `held` | Seats are **temporarily reserved** for 10 minutes while the user is on the payment page |
| `confirmed` | Payment completed — **real booking** |
| `cancelled` | Hold expired, or the user cancelled the hold |

> **Important:** the seat grid is **not** stored anywhere. It is *generated* from `Screen.rows × Screen.columns`. A seat is "taken" only if a `BookingSeat` for that showtime points to it.

---

## 4. User Workflow (the booking flow)

```
Home ──► Movie page ──► Seat selection ──► Order summary ──► Payment ──► Success
 │          │               │                  │                │           │
 GET       GET             GET                 computed        POST        (real
 /movies   /movies/:id     /showtimes/         from selected   /bookings/  ref#)
           /showtimes      :id/seats           seats × price   :id/confirm
```

### Step-by-step

1. **Home (`/`)** — the app fetches `GET /api/movies` and renders the live movie list (poster, rating, genre, runtime). Search and genre filters run in the browser.

2. **Movie page (`/movie/:id`)** — fetches `GET /api/movies/:id/showtimes`, which returns only **upcoming** showtimes with their theater, screen, and price. The user picks one and clicks **Book**.

3. **Seat selection (`/seat-selection`)** — fetches `GET /api/showtimes/:id/seats`, which returns the generated grid. Each seat is:
   - `available` — nobody has it
   - `held` — another user has it held right now
   - `reserved` — someone completed a booking for it
   
   The user clicks seats, sees a running total, and clicks **Continue**. The frontend calls `POST /api/showtimes/:id/hold` with the seat labels. The server **atomically** checks the seats are still free and creates a `Booking` with `status: held` and a **10-minute expiry** (`createdAt + 10 min`).

4. **Order summary** — shows seats × per-seat price + 5% service fee. A **live countdown timer** ticks down from the server-provided `expiresAt`.

5. **Payment** — after a 2-second simulated "processing," the frontend calls `POST /api/bookings/:id/confirm`. The server flips the booking to `confirmed`. A real row now exists in the DB.

6. **Success** — shows the real reference `#BK-00027` and the confirmed details.

7. **My Bookings** — `GET /api/my/bookings` lists the user's bookings. Held bookings show a **Cancel** button (`DELETE /api/bookings/:id` → status `cancelled`, seats freed instantly).

### What happens if the 10-minute timer runs out?

- The seat map fetch lazily flips the expired `held` booking to `cancelled`, so the seats look available again.
- If the user tries to pay anyway, `confirm` rejects with `409 Hold expired` and sends them back to seat selection.
- The frontend countdown auto-releases the hold and clears the selection.

### Seat conflict handling

- Two users selecting the same seat: the **second** `POST /hold` gets `409 Seat X is no longer available`.
- A user can never confirm a seat another user has already confirmed.

---

## 5. Admin Workflow (management)

Admin panel pages (all behind `authenticate` + `requireAdmin`):

| Page | What it manages | API |
|---|---|---|
| Dashboard | KPIs & revenue chart | `GET /api/admin/bookings/stats` |
| Movies | Add / edit / delete films | `GET/POST/PUT/DELETE /api/admin/movies[...]` |
| Theaters | Add / edit / delete venues | `GET/POST/PUT/DELETE /api/admin/theaters[...]` |
| Screens | Add / edit screens *inside* a theater (name + rows × columns) | `GET/POST /api/admin/theaters/:id/screens`, `PUT/DELETE /api/admin/screens/:id` |
| Showtimes | Schedule a movie on a screen at a time with a price | `GET/POST/PUT/DELETE /api/admin/showtimes[...]` |
| Bookings | Read-only log of all bookings | `GET /api/admin/bookings` |

### Typical admin sequence to make a movie bookable by users

1. **Add a Movie** (`admin1@cinema.com`) → appears on the user Home page.
2. **Add a Theater** → e.g. "Grand Cinema".
3. **Add a Screen** under that theater → e.g. rows `10`, columns `12`.
4. **Add a Showtime** linking movie + screen + time + price → appears on the user's Movie page under "Select a Showtime".
5. Users book seats → those bookings show up in the admin **Bookings** log and the **Dashboard** stats.

> The admin UI can also filter bookings and view per-movie revenue/occupancy.

---

## 6. Authentication Model

| Route | Who | Notes |
|---|---|---|
| `POST /api/auth/register` | anyone | Creates a `user`-role account, returns a JWT |
| `POST /api/auth/login` | anyone | Works for **both** users and admins; returns a JWT |
| `/api/me`, `/api/my/bookings`, `/api/showtimes/:id/hold`, `/api/bookings/:id/confirm`, `/api/bookings/:id` | any logged-in user | Guarded by `authenticate` (valid JWT) |
| `/api/admin/*` | **admin only** | Guarded by `authenticate` + `requireAdmin` (checks `role === 'admin'`) |

- Tokens are stored in `localStorage` (`token` key for users, `admin_token` for admins).
- On a `401`, the API client clears the token and redirects to the login page.

---

## 7. API Reference (full)

### Public (no auth)

| Method | Path | Description |
|---|---|---|
| GET | `/api/movies` | List movies (`?search=&genre=`) |
| GET | `/api/movies/:id/showtimes` | Upcoming showtimes for one movie (nested theater/screen) |
| GET | `/api/showtimes` | List upcoming showtimes (`?movie_id=&date=`) |
| GET | `/api/showtimes/:id/seats` | Generated seat grid + the caller's own held seats (`mySeats`) |

### Auth

| Method | Path | Body |
|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` → `201 { token, user }` |
| POST | `/api/auth/login` | `{ email, password }` → `200 { token, user }` |

### User (JWT required)

| Method | Path | Description |
|---|---|---|
| GET | `/api/me` | Current user profile |
| GET | `/api/my/bookings` | Current user's bookings (nested movie/theater/seats) |
| POST | `/api/showtimes/:id/hold` | Body `{ seats: ["A1","B2"] }` → `201` with `expiresAt` |
| POST | `/api/bookings/:id/confirm` | Convert a held booking to confirmed |
| DELETE | `/api/bookings/:id` | Cancel a held booking (seats freed) |

### Admin (JWT + admin role required)

| Method | Path |
|---|---|
| GET/POST/PUT/DELETE | `/api/admin/movies` (and `/movies/:id`) |
| GET/POST/PUT/DELETE | `/api/admin/theaters` (and `/theaters/:id`) |
| GET/POST | `/api/admin/theaters/:theaterId/screens` |
| PUT/DELETE | `/api/admin/screens/:id` |
| GET/POST/PUT/DELETE | `/api/admin/showtimes` (and `/showtimes/:id`) |
| GET | `/api/admin/bookings`, `/api/admin/bookings/stats` |

---

## 8. Common Questions

**Why is a seat "held" not immediately gone?**
Held seats are released automatically after 10 minutes if payment isn't completed, so abandoned carts don't block seats forever.

**Can a confirmed booking be cancelled?**
No — `DELETE /api/bookings/:id` returns `409` for confirmed bookings. Only `held` bookings can be cancelled.

**Where is the seat map defined?**
Nowhere hardcoded. It's generated from the screen's `rows × columns` on every request to `/api/showtimes/:id/seats`, so editing a screen's size in the admin panel changes the seat layout immediately.

**Why did my movie show no showtimes?**
`/api/movies/:id/showtimes` only returns **upcoming** showtimes (`startTime >= now`). Seeded showtimes are dated from the seed run — re-run `cd backend && npm run seed` for fresh dates.

**What happens if two users grab the same seat?**
The first `hold` wins. The second gets `409` and the UI refreshes the seat map to show it as taken.
