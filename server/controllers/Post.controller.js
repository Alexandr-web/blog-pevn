const ModelPost = require("../models/Post");
const removeFile = require("../removeFile");

class Post {
  async getPost(req, res) {
    try {
      const posts = await ModelPost.findAll();

      return res.status(200).json({ ok: true, posts: posts || [], });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  async getSlicePosts(req, res) {
    try {
      const { size, count, } = req.body;
      const posts = await ModelPost.findAll();
      const start = size * count;
      const end = start + size;
      const freshPosts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const result = freshPosts.slice(start, end);

      return res.status(200).json({ ok: true, posts: result, end: end >= posts.length, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  async getOnePost(req, res) {
    try {
      const { id, } = req.params;
      const post = await ModelPost.findOne({ where: { id, }, });

      return res.status(200).json({ ok: true, post: post || {}, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  async create(req, res) {
    try {
      if (!req.auth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции вам необходимо авторизоваться", status: 403, });
      }

      const dataPost = {};

      Object.keys(req.body).map((key) => {
        if (["title", "message"].includes(key)) {
          dataPost[key] = req.body[key];
        }
      });

      dataPost.images = req.files ? req.files.map((file) => file.filename) : [];
      dataPost.userId = req.userId;

      await ModelPost.create(dataPost);

      return res.status(200).json({ ok: true, message: "Пост создан", status: 200, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  async setLike(req, res) {
    try {
      if (!req.auth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции вам необходимо авторизоваться", status: 403, });
      }

      const { postId, } = req.body;
      const { userId, } = req;
      const post = await ModelPost.findOne({ where: { id: postId, }, });
      const indexFindUser = post.likes.findIndex((id) => id === userId);
      let copyLikes = [...post.likes];

      if (indexFindUser !== -1) {
        copyLikes = copyLikes.filter((id, index) => index !== indexFindUser);
      } else {
        copyLikes.push(userId);
      }

      await post.update({ likes: copyLikes, });
      await post.save();

      return res.status(200).json({ ok: true, likes: post.likes, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  async edit(req, res) {
    try {
      if (!req.auth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции вам необходимо авторизоваться", status: 403, });
      }

      const { title, message, images, } = req.body;
      const { id, } = req.params;
      const files = req.files;
      const post = await ModelPost.findOne({ where: { id, }, });

      if (!post) {
        return res.status(404).json({ ok: false, message: "Пост не найден", status: 404, });
      }

      const { userId, } = post.dataValues;
      const postImages = post.images;

      if (userId !== req.userId) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для редактирования этого поста", status: 403, });
      }

      postImages.map(async (image) => {
        if (!JSON.parse(images).map((val) => val.replace(/^\/\_nuxt\/postsImages\//, "")).includes(image)) {
          removeFile([__dirname, "../../", "postsImages", image], res);
        }
      });

      await post.update({
        images: files.length ? files.map((file) => file.filename).concat(JSON.parse(images)) : JSON.parse(images),
        title,
        message,
      });
      await post.save();

      return res.status(200).json({ ok: true, message: "Пост успешно отредактирован", status: 200, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, });
    }
  }

  async remove(req, res) {
    try {
      if (!req.auth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции вам необходимо авторизоваться", status: 403, });
      }

      const { id: postId, } = req.params;
      const post = await ModelPost.findOne({ where: { id: postId, }, });

      if (!post) {
        return res.status(404).json({ ok: false, message: "Пост не найден", status: 404, });
      }

      const { userId, } = post.dataValues;
      const postImages = post.images;

      if (req.userId !== userId) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для удаления этого поста", status: 403, });
      }

      postImages.map(async (image) => {
        removeFile([__dirname, "../../", "postsImages", image.replace(/^\/\_nuxt\/postsImages\//, "")], res);
      });

      await post.destroy();

      return res.status(200).json({ ok: true, message: "Пост был удален", status: 200, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, });
    }
  }
}

module.exports = new Post();