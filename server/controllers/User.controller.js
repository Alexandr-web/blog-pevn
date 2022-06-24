const { User: ModelUser, Post } = require("../models/index");
const bcrypt = require("bcrypt");
const removeFile = require("../removeFile");

class User {
  async update(req, res) {
    try {
      if (!req.auth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции вам необходимо авторизоваться", status: 403 });
      }

      const body = req.body;
      const { userId } = req;
      const updates = {};
      const user = await ModelUser.findOne({ where: { id: userId } });

      for (let key in body) {
        updates[key] = key !== "password" ? body[key] : await bcrypt.hash(body[key], 7);
      }

      if (updates.email) {
        const findMatchUser = await ModelUser.findOne({ where: { email: updates.email } });

        if (findMatchUser && findMatchUser.dataValues.id !== parseInt(userId)) {
          return res.status(400).json({ ok: false, message: "Пользователь с таким email уже существует", status: 400 });
        }
      }

      if (req.file) {
        updates.avatar = req.file.filename;

        if (user.avatar.replace(/^\/\_nuxt\/avatars\//, "") !== "user.png") {
          removeFile([__dirname, "../../", "avatars", user.avatar.replace(/^\/\_nuxt\/avatars\//, "")], res);
        }
      }

      await user.update(updates);
      await user.save();

      return res.status(200).json({ ok: true, message: "Данные были изменены", status: 200 });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера" });
    }
  }

  async deleteAccount(req, res) {
    try {
      if (!req.auth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции вам необходимо авторизоваться", status: 403 });
      }

      const { userId } = req;
      const user = await ModelUser.findOne({ where: { id: userId } });
      const posts = await Post.findAll();
      const userPosts = posts.filter(post => post.userId === userId);
      const likesPost = posts.filter(post => post.likes.findIndex(id => id === userId) !== -1);

      if (user.avatar.replace(/^\/\_nuxt\/avatars\//, "") !== "user.png") {
        removeFile([__dirname, "../../", "avatars", user.avatar.replace(/^\/\_nuxt\/avatars\//, "")], res);
      }

      likesPost.map(async post => {
        await post.update({ likes: post.likes.filter(id => id !== userId) });
        await post.save();
      });

      userPosts.map(async post => {
        post.images.map(async image => {
          removeFile([__dirname, "../../", "postsImages", image.replace(/^\/\_nuxt\/postsImages\//, "")], res);
        });

        await post.destroy();
      });

      await user.destroy();

      return res.status(200).json({ ok: true, message: "Аккаунт был удален", status: 200 });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера" });
    }
  }
}

module.exports = new User();
