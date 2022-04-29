const express = require("express");
const router = express.Router();
const authController = require("../controllers/Auth.controller");

router.post("/login", authController.login);
router.get("/user/:id", authController.getUser);
router.post("/registration", authController.registration);

module.exports = router;