const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Screen = require("./Screen");

const Seat = sequelize.define(
  "Seat",
  {
    seatId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    screenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Screen,
        key: "screenId",
      },
    },

    rowLabel: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    seatNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    seatType: {
      type: DataTypes.ENUM("Regular", "Premium", "VIP"),
      defaultValue: "Regular",
    },

    status: {
      type: DataTypes.ENUM(
        "Available",
        "Reserved",
        "Blocked",
        "Maintenance"
      ),
      defaultValue: "Available",
    },
  },
  {
    tableName: "seats",
    timestamps: true,
  }
);

// ===========================
// Relationships
// ===========================

Screen.hasMany(Seat, {
  foreignKey: "screenId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Seat.belongsTo(Screen, {
  foreignKey: "screenId",
});

module.exports = Seat;