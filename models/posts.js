const { DataTypes } = require("sequelize"); // Import the built-in data types

const  sequelize  = require("../database");
// Import the built-in data types

const Post = sequelize.define(
   "publicaciones",
   {

      // Our primaryKey, book id, our unique identifier
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
      },

      // This will create a title for a column of the book
      texto: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      
   },
   {
      // For the sake of clarity we specify our indexes
      indexes: [{ unique: true, fields: ["id"] }],
      tableName: ["publicaciones"],
      timestamps: false,
   }
);

module.exports = {
   Post,
   sequelize,
};
