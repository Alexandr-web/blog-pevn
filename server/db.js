const { Sequelize, } = require("sequelize");

module.exports = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.USER_NAME,
  process.env.USER_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
  }
);