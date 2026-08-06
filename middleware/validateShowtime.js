const validateShowtime = (req, res, next) => {
  const { movieId, screenId, startTime, endTime } = req.body;

  if (!movieId || !screenId || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: "Movie, screen, start time and end time are required"
    });
  }

  if (new Date(startTime) >= new Date(endTime)) {
    return res.status(400).json({
      success: false,
      message: "End time must be after start time"
    });
  }

  next();
};

module.exports = validateShowtime;