const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Movie = require("./Movie");
const Screen = require("./Screen");

const Showtime = sequelize.define(
  "Showtime",
  {
    showtimeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Movie,
        key: "movieId",
      },
    },

    screenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Screen,
        key: "screenId",
      },
    },

    showDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    ticketPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("Active", "Cancelled"),
      defaultValue: "Active",
    },
  },
  {
    tableName: "showtimes",
    timestamps: true,
  }
);

// ===========================
// Relationships
// ===========================

// Movie → Showtime
Movie.hasMany(Showtime, {
  foreignKey: "movieId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Showtime.belongsTo(Movie, {
  foreignKey: "movieId",
});

// Screen → Showtime
Screen.hasMany(Showtime, {
  foreignKey: "screenId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Showtime.belongsTo(Screen, {
  foreignKey: "screenId",
});

module.exports = Showtime;