const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sequelize = require("./db");
const cors = require("cors");
const host = require("./host");

const authRouter = require("./routes/auth.router");
const postRouter = require("./routes/post.router");
const userRouter = require("./routes/user.router");

require("dotenv").config();
require("./models/index");

app.use(cors({ origin: [host], }));
app.use(bodyParser.urlencoded({ extended: true, }));
app.use(bodyParser.json());

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log("Connection has been established successfully.");
  } catch (err) {
    console.log(err);
  }
};

connectToDatabase();

app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

module.exports = app;