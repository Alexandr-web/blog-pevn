const { Post: ModelPost, User } = require("../models/index");

class Post {
  async getPost(req, res) {
    try {
      const posts = await ModelPost.findAll();

      return res.status(200).json({ ok: true, posts: posts || [] });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера" });
    }
  }

  async create(req, res) {
    try {
      if (req.auth) {
        const dataPost = {};

        for (let key in req.body) {
          if (["title", "message", "userId"].includes(key)) {
            dataPost[key] = req.body[key];
          }
        }

        dataPost.images = req.files.map(file => file.filename);

        await ModelPost.create(dataPost);

        return res.status(200).json({ ok: true, message: "Пост создан", status: 200 });
      } else {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции вам необходимо авторизоваться", status: 403 });
      }
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера" });
    }
  }

  async setLike(req, res) {
    try {
      if (req.auth) {
        const { userId, postId } = req.body;
        const post = await ModelPost.findOne({ where: { id: postId } });
        const indexFindUser = post.likes.findIndex(id => id === userId);
        let copyLikes = [...post.likes];

        if (indexFindUser !== -1) {
          copyLikes = copyLikes.filter((id, index) => index !== indexFindUser);
        } else {
          copyLikes.push(userId);
        }

        await post.update({ likes: copyLikes });
        await post.save();

        return res.status(200).json({ ok: true, likes: post.likes });
      } else {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции вам необходимо авторизоваться", status: 403 });
      }
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера" });
    }
  }
}

module.exports = new Post();