const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  name: {
    type: DataTypes.STRING
  },

  email: {
    type: DataTypes.STRING,
    unique: true
  },

  avatar: {
    type: DataTypes.TEXT,
    defaultValue: "user.png"
  },

  password: {
    type: DataTypes.TEXT
  },

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
}, { tableName: "user" });

const Post = sequelize.define("post", {
  title: {
    type: DataTypes.TEXT
  },

  message: {
    type: DataTypes.TEXT,
  },

  likes: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: []
  },

  images: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: []
  },

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
}, { tableName: "post" });

User.hasMany(Post);
Post.belongsTo(User);

module.exports = {
  Post,
  User
};