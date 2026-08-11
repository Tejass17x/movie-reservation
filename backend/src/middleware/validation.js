import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Format the first error message nicely
      const errorMessage = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return res.status(400).json({ error: errorMessage, details: err.errors });
    }
    return res.status(400).json({ error: 'Validation error' });
  }
};

// Login Validation Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Movie Validation Schema
export const movieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  genre: z.string().min(1, 'Genre is required'),
  durationMinutes: z.number().int().positive('Duration must be a positive integer'),
  description: z.string().optional().nullable(),
  posterUrl: z.string().url('Must be a valid URL').or(z.string().length(0)).optional().nullable(),
  rating: z.string().min(1, 'Rating is required').optional().nullable(),
});

// Theater Validation Schema
export const theaterSchema = z.object({
  name: z.string().min(1, 'Theater name is required'),
  location: z.string().min(1, 'Location is required'),
});

// Screen Validation Schema
export const screenSchema = z.object({
  name: z.string().min(1, 'Screen name is required'),
  rows: z.number().int().min(1, 'Rows must be at least 1').max(30, 'Rows cannot exceed 30'),
  columns: z.number().int().min(1, 'Columns must be at least 1').max(30, 'Columns cannot exceed 30'),
});

// Showtime Validation Schema
export const showtimeSchema = z.object({
  movieId: z.number().int('Invalid movie ID'),
  screenId: z.number().int('Invalid screen ID'),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start time datetime format',
  }),
  price: z.number().positive('Price must be a positive number'),
});
