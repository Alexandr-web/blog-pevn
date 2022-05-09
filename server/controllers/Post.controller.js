const { Post: ModelPost } = require("../models/index");

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

  async getOnePost(req, res) {
    try {
      const { id } = req.params;
      const post = await ModelPost.findOne({ where: { id } });

      return res.status(200).json({ ok: true, post: post || {} });
    } catch(err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ощибка сервера" });
    }
  }

  async create(req, res) {
    try {
      if (req.auth) {
        const dataPost = {};

        for (let key in req.body) {
          if (["title", "message"].includes(key)) {
            dataPost[key] = req.body[key];
          }
        }

        dataPost.images = req.files ? req.files.map(file => file.filename) : [];
        dataPost.userId = req.userId;

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
        const { postId } = req.body;
        const { userId } = req;
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

  async edit(req, res) {
    try {
      if (req.auth) {
        const { title, message, images } = req.body;
        const { id } = req.params;
        const files = req.files;
        const post = await ModelPost.findOne({ where: { id } });

        if (post) {
          await post.update({
            images: files.length ? files.map(file => file.filename).concat(JSON.parse(images)) : JSON.parse(images), 
            title, 
            message
          });
          await post.save();
        } else {
          return res.status(404).json({ ok: false, message: "Пост не найден", status: 404 });
        }

        return res.status(200).json({ ok: true, message: "Пост успешно отредактирован", status: 200 });
      } else {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции вам необходимо авторизоваться", status: 403 });
      }
    } catch(err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500 });
    }
  }
}

module.exports = new Post();