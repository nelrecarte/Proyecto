const { DataTypes } = require("sequelize"); // Import the built-in data types

const sequelize = require("../database");
// const { Post } = require("./posts");
// const { Friend } = require("./friends");
// // Import the built-in data types

const User = sequelize.define(
  "usuarios",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    carrera: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    num_cuenta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

// Post.belongsTo(User, {
//   foreignKey: "user_id"
// });

module.exports = {
  User,
  sequelize,
};
