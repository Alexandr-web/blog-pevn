const { Post: ModelPost } = require("../models/index");

class Post {
  async getPost(req, res) {
    try {
      const posts = await ModelPost.findAll();

      return res.status(200).json({ ok: true, posts });
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

        return res.status(200).json({ ok: true, message: "Пост создан" });
      } else {
        return res.status(403).json({ ok: true, message: "Для выполнения данной операции вам необходимо авторизоваться" });
      }
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера" });
    }
  }
}

module.exports = new Post();