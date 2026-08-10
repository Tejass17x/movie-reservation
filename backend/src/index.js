import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Controllers
import * as authController from './controllers/authController.js';
import * as movieController from './controllers/movieController.js';
import * as theaterController from './controllers/theaterController.js';
import * as showtimeController from './controllers/showtimeController.js';
import * as bookingController from './controllers/bookingController.js';

// Middlewares
import { authenticate, requireAdmin } from './middleware/auth.js';
import {
  validate,
  loginSchema,
  movieSchema,
  theaterSchema,
  screenSchema,
  showtimeSchema,
} from './middleware/validation.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Request logging
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  return res.json({ status: 'OK', timestamp: new Date() });
});

// AUTH ROUTE
app.post('/api/auth/login', validate(loginSchema), authController.login);

// PROTECTED ADMIN ROUTES (All routes below require authentication and admin role)
const adminRouter = express.Router();
adminRouter.use(authenticate, requireAdmin);

// Movies CRUD
adminRouter.get('/movies', movieController.getMovies);
adminRouter.get('/movies/:id', movieController.getMovieById);
adminRouter.post('/movies', validate(movieSchema), movieController.createMovie);
adminRouter.put('/movies/:id', validate(movieSchema), movieController.updateMovie);
adminRouter.delete('/movies/:id', movieController.deleteMovie);

// Theaters CRUD
adminRouter.get('/theaters', theaterController.getTheaters);
adminRouter.post('/theaters', validate(theaterSchema), theaterController.createTheater);
adminRouter.get('/theaters/:id', theaterController.getTheaterById);
adminRouter.put('/theaters/:id', validate(theaterSchema), theaterController.updateTheater);
adminRouter.delete('/theaters/:id', theaterController.deleteTheater);

// Nested Screens CRUD
adminRouter.get('/theaters/:theaterId/screens', theaterController.getScreensByTheater);
adminRouter.post('/theaters/:theaterId/screens', validate(screenSchema), theaterController.createScreen);
adminRouter.put('/screens/:id', validate(screenSchema), theaterController.updateScreen);
adminRouter.delete('/screens/:id', theaterController.deleteScreen);

// Showtimes CRUD
adminRouter.get('/showtimes', showtimeController.getShowtimes);
adminRouter.post('/showtimes', validate(showtimeSchema), showtimeController.createShowtime);
adminRouter.get('/showtimes/:id', showtimeController.getShowtimeById);
adminRouter.put('/showtimes/:id', validate(showtimeSchema), showtimeController.updateShowtime);
adminRouter.delete('/showtimes/:id', showtimeController.deleteShowtime);

// Bookings (Read-only Reporting)
adminRouter.get('/bookings', bookingController.getBookings);
adminRouter.get('/bookings/stats', bookingController.getBookingStats);

app.use('/api/admin', adminRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  return res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Movie Reservation System Admin API is running on http://localhost:${PORT}`);
});
