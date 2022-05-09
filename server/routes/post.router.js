const express = require("express");
const router = express.Router();
const postController = require("../controllers/Post.controller");
const isAuth = require("../middleware/isAuth");
const multer = require("multer");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "postsImages");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.get("/", postController.getPost);
router.get("/:id", postController.getOnePost);
router.post("/create", isAuth, upload.any("images"), postController.create);
router.post("/like", isAuth, postController.setLike);
router.post("/edit/:id", isAuth, upload.any("files"), postController.edit);

module.exports = router;