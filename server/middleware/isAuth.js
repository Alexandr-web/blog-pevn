import jwtDecode from "jwt-decode";

const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (auth) {
      const token = auth.split(" ")[1];

      if (token) {
        const { dataValues, } = jwtDecode(token || "");
        const candidate = await User.findOne({ where: { id: dataValues.id, }, });

        req.auth = Boolean(candidate);
        req.userId = dataValues.id;
      } else {
        req.auth = false;
      }
    } else {
      req.auth = false;
    }

    next();
  } catch (err) {
    console.log(err);

    return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
  }
};