const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Theater = sequelize.define(
  "Theater",
  {
    theaterId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    theaterName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    totalScreens: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
  },
  {
    tableName: "theaters",
    timestamps: true,
  }
);

module.exports = Theater;