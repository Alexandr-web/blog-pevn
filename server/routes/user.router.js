const express = require("express");
const userController = require("../controllers/User.controller");
const isAuth = require("../middleware/isAuth");
const multer = require("multer");
const router = express.Router();
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "avatars");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post("/update", isAuth, upload.single("avatar"), userController.update);

module.exports = router;