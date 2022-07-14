const sequelize = require("../db");
const { DataTypes, } = require("sequelize");

const Post = sequelize.define("post", {
  title: { type: DataTypes.TEXT, },

  message: { type: DataTypes.TEXT, },

  likes: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },

  images: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: [],
  },

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
}, { tableName: "post", });

module.exports = Post;