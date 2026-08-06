const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Movie = sequelize.define(
  "Movie",
  {
    movieId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duration in minutes",
    },

    releaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },

    posterUrl: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.ENUM("Now Showing", "Coming Soon"),
      defaultValue: "Coming Soon",
    },
  },
  {
    tableName: "movies",
    timestamps: true,
  }
);

// ==========================
// Associations
// ==========================
Movie.associate = (models) => {
  Movie.hasMany(models.Showtime, {
    foreignKey: "movieId",
    as: "showtimes",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = Movie;