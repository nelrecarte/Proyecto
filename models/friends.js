// Import the built-in data types
const { DataTypes } = require("sequelize"); // Import the built-in data types

const sequelize = require("../database");

const Friend = sequelize.define(
  "amigos",
  {
    UserID1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserID2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);



module.exports = {
  Friend,
  sequelize,
};
