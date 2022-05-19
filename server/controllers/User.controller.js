const { User: ModelUser, Post } = require("../models/index");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

class User {
  async update(req, res) {
    try {
      if (req.auth) {
        const body = req.body;
        const { userId } = req;
        const updates = {};
        const user = await ModelUser.findOne({ where: { id: userId } });

        for (let key in body) {
          if (key !== "password") {
            updates[key] = body[key];
          }

          if (key === "password") {
            updates[key] = await bcrypt.hash(body[key], 7);
          }
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
            const filePath = path.resolve(__dirname, "../../", "avatars", user.avatar.replace(/^\/\_nuxt\/avatars\//, ""));

            if (await fs.existsSync(filePath)) {
              fs.unlink(filePath, err => {
                if (err) {
                  console.log(err);
  
                  return res.status(500).json({ ok: false, message: "Произошла ошибка при удалении фото", status: 500 });
                }
              });
            }
          }
        }

        await user.update(updates);
        await user.save();

        return res.status(200).json({ ok: true, message: "Данные были изменены", status: 200 });
      } else {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции вам необходимо авторизоваться", status: 403 });
      }
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера" });
    }
  }

  async deleteAccount(req, res) {
    try {
      if (req.auth) {
        const { userId } = req;
        const user = await ModelUser.findOne({ where: { id: userId } });
        const posts = await Post.findAll();
        const userPosts = posts.filter(post => post.userId === userId);
        const likesPost = posts.filter(post => post.likes.findIndex(id => id === userId) !== -1);

        if (user.avatar.replace(/^\/\_nuxt\/avatars\//, "") !== "user.png") {
          const filePath = path.resolve(__dirname, "../../", "avatars", user.avatar.replace(/^\/\_nuxt\/avatars\//, ""));

          if (await fs.existsSync(filePath)) {
            fs.unlink(filePath, err => {
              if (err) {
                console.log(err);
  
                return res.status(500).json({ ok: false, message: "Произошла ошибка при удалении фото", status: 500 });
              }
            });
          }
        }

        likesPost.map(async post => {
          await post.update({ likes: post.likes.filter(id => id !== userId) });
          await post.save();
        });
        
        userPosts.map(async post => {
          post.images.map(async image => {
            const filePath = path.resolve(__dirname, "../../", "postsImages", image.replace(/^\/\_nuxt\/postsImages\//, ""));

            if (await fs.existsSync(filePath)) {
              fs.unlink(filePath, err => {
                if (err) {
                  console.log(err);
  
                  return res.status(500).json({ ok: false, message: "Произошла ошибка при удалении фото", status: 500 });
                }
              });
            }
          });

          await post.destroy();
        });

        await user.destroy();

        return res.status(200).json({ ok: true, message: "Аккаунт был удален", status: 200 });
      } else {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции вам необходимо авторизоваться", status: 403 });
      }
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера" });
    }
  }
}

module.exports = new User();