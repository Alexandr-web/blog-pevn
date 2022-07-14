const sequelize = require("../db");
const { DataTypes, } = require("sequelize");

const User = sequelize.define("user", {
  name: { type: DataTypes.STRING, },

  email: {
    type: DataTypes.STRING,
    unique: true,
  },

  avatar: {
    type: DataTypes.TEXT,
    defaultValue: "user.png",
  },

  password: { type: DataTypes.TEXT, },

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
}, { tableName: "user", });

module.exports = User;