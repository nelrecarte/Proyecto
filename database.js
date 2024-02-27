const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("proyecto", "sa", "zTtUKKGAwQ1", {
    host: "localhost",
    dialect:
      "mssql" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
  });

module.exports = sequelize;