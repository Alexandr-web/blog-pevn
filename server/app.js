const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sequelize = require("./db");

require("dotenv").config();
require("./models/index");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log("Connection has been established successfully.");
  } catch (err) {
    console.log(err);
  }
}

connectToDatabase();

module.exports = app;