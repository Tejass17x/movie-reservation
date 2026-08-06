const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Theater = require("./Theater");

const Screen = sequelize.define(
  "Screen",
  {
    screenId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    screenName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    theaterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Theater,
        key: "theaterId",
      },
    },

    totalRows: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    seatsPerRow: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    screenType: {
      type: DataTypes.ENUM("2D", "3D", "IMAX", "4DX"),
      defaultValue: "2D",
    },

    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
  },
  {
    tableName: "screens",
    timestamps: true,
  }
);

// ==============================
// Relationships
// ==============================

Theater.hasMany(Screen, {
  foreignKey: "theaterId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Screen.belongsTo(Theater, {
  foreignKey: "theaterId",
});

module.exports = Screen;