const jwt = require("jsonwebtoken");
const { User } = require("../models/index");
const bcrypt = require("bcrypt");

class Auth {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const candidate = await User.findOne({ where: { email } });

      if (!candidate) {
        return res.status(404).json({ ok: true, message: "Такого пользователя не существует", status: 404 });
      }

      const isTruePassword = await bcrypt.compare(password, candidate.password);

      if (!isTruePassword) {
        return res.status(400).json({ ok: true, message: "Неверный пароль", status: 400 });
      }

      const token = jwt.sign({ ...candidate }, process.env.SECRET_KEY, { expiresIn: Math.floor(Date.now() / 1000) + (60 * 60) });

      return res.status(200).json({ ok: true, message: "Вход выполнен успешно", token: `Bearer ${token}`, status: 200 });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500 });
    }
  }

  async registration(req, res) {
    try {
      const { password, email } = req.body;
      const candidate = await User.findOne({ where: { email } });

      if (candidate) {
        return res.status(400).json({ ok: true, message: "Такой пользователь уже зарегистрирован", status: 400 });
      }

      const hashPassword = await bcrypt.hash(password, 7);

      await User.create({ ...req.body, password: hashPassword });

      return res.status(200).json({ ok: true, message: "Пользователь зарегистрирован", status: 200 });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500 });
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const candidate = await User.findOne({ where: { id } });
      const result = candidate ? candidate.dataValues : {};

      return res.status(200).json({ ok: true, user: result });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: fasle, message: "Произошла ошибка сервера" });
    }
  }
}

module.exports = new Auth();