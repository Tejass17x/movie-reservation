const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const { connectDB, sequelize } = require("./config/database");

// =======================
// Import Models
// =======================
require("./models/Movie");
require("./models/Theater");
require("./models/Screen");
require("./models/Seat");
require("./models/Showtime");

// =======================
// Import Routes
// =======================
const movieRoutes = require("./routes/movieRoutes");
const theaterRoutes = require("./routes/theaterRoutes");
const screenRoutes = require("./routes/screenRoutes");
const seatRoutes = require("./routes/seatRoutes");
const showtimeRoutes = require("./routes/showtimeRoutes");
const publicRoutes = require("./routes/publicRoutes");

const app = express();

// =======================
// Middleware
// =======================
app.use(cors());
app.use(express.json());

// =======================
// Database Connection
// =======================
connectDB();

// =======================
// Sync Database
// =======================
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database Synced Successfully");
  })
  .catch((err) => {
    console.log("❌ Database Sync Failed");
    console.log(err);
  });

// =======================
// API Routes
// =======================
app.use("/api/movies", movieRoutes);
app.use("/api/theaters", theaterRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/showtimes", showtimeRoutes);

// Public APIs
app.use("/api/public", publicRoutes);

// =======================
// Home Route
// =======================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🎬 Movie Reservation API Running Successfully",
  });
});

// =======================
// 404 Route
// =======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});