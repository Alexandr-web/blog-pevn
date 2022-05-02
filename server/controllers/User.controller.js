const { User: ModelUser, Post } = require("../models/index");
const bcrypt = require("bcrypt");

class User {
  async update(req, res) {
    try {
      if (req.auth) {
        const body = req.body;
        const { userId } = body;
        const updates = {};
        const user = await ModelUser.findOne({ where: { id: userId } });

        if (user) {
          for (let key in body) {
            if (!["userId", "password"].includes(key)) {
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
          }

          await user.update(updates);
          await user.save();

          return res.status(200).json({ ok: true, message: "Данные были изменены", status: 200 });
        } else {
          return res.status(404).json({ ok: false, message: "Данного пользователя не существует", status: 404 });
        }
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
        const { userId } = req.body;
        const user = await ModelUser.findOne({ where: { id: userId } });

        if (user) {
          const posts = await Post.findAll();
          const userPosts = posts.filter(post => post.userId === userId);
          const likesPost = posts.filter(post => post.likes.findIndex(id => id === userId) !== -1);

          likesPost.map(async post => {
            await post.update({ likes: post.likes.filter(id => id !== userId) });
            await post.save();
          });
          userPosts.map(async post => await post.destroy());

          await user.destroy();

          return res.status(200).json({ ok: true, message: "Аккаунт был удален", status: 200 });
        } else {
          return res.status(404).json({ ok: false, message: "Данного пользователя не существует", status: 404 });
        }
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