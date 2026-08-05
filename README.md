# movie-reservation

A full-stack movie ticket booking application built with a React frontend and an Express + MySQL backend.

## Features

- Dynamic seat selection
- Interactive seat states (Available, Selected, Held, Reserved, Blocked)
- 10-minute seat hold countdown timer
- Order summary
- Payment page with live card preview
- Booking confirmation (Digital Ticket UI)
- Catalog and showtime management service

## Tech Stack

- Frontend: React.js, React Router, Context API, CSS3, Vite
- Backend: Node.js, Express, MySQL, Sequelize

## Getting Started

### Prerequisites

- Node.js
- MySQL

### Installation

```bash
npm install
```

### Run the backend server

```bash
npm run server
```

### Run the frontend dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

## Project Structure

- `server.js` — Express backend entry point
- `config/` — Database configuration
- `controllers/` — Route controllers
- `middleware/` — Validation middleware
- `models/` — Sequelize models
- `routes/` — API routes
- `services/` — Business logic services
- `src/` — React frontend
