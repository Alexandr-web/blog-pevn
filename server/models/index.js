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

  password: {
    type: DataTypes.STRING
  },

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
}, { tableName: "user" });

const Post = sequelize.define("post", {
  title: {
    type: DataTypes.STRING
  },

  message: {
    type: DataTypes.STRING,
  },

  likes: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: []
  },

  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
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