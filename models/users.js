const { DataTypes } = require("sequelize"); // Import the built-in data types

const  sequelize  = require("../database");
// Import the built-in data types

const User = sequelize.define(
   "usuarios",
   {
      // Each attribute will pair with a column
      // Here we define our model attributes

      // Our primaryKey, book id, our unique identifier
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
      },

      // This will create a title for a column of the book
      nombre: {
         type: DataTypes.STRING,
         allowNull: false,
      },
   },
   {
      // For the sake of clarity we specify our indexes
      indexes: [{ unique: true, fields: ["id"] }],
      tableName: ["usuarios"],
      timestamps: false,
   }
);

module.exports = {
   User,
   sequelize,
};
