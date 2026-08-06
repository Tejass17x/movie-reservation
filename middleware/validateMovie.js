const validateMovie = (req, res, next) => {
  const { title, genre, duration } = req.body;

  if (!title || !genre || !duration) {
    return res.status(400).json({
      success: false,
      message: "Title, genre and duration are required"
    });
  }

  if (Number(duration) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Duration must be greater than 0"
    });
  }

  next();
};

module.exports = validateMovie;