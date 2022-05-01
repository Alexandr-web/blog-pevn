const { User: ModelUser } = require("../models/index");
const bcrypt = require("bcrypt");

class User {
  async update(req, res) {
    try {
      if (req.auth) {
        const body = req.body;
        const { userId } = body;
        const updates = {};
        const user = await ModelUser.findOne({ where: { id: userId } });

        for (let key in body) {
          if (!["userId", "password"].includes(key)) {
            updates[key] = body[key];
          }

          if (key === "password") {
            updates[key] = await bcrypt.hash(body[key], 7);
          }
        }

        if (req.file) {
          updates.avatar = req.file.filename;
        }

        await user.update(updates);
        await user.save();

        return res.status(200).json({ ok: true, message: "Данные были изменены", status: 200 });
      } else {
        return res.status(403).json({ ok: true, message: "Для выполнения данной операции вам необходимо авторизоваться", status: 403 });
      }
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера" });
    }
  }
}

module.exports = new User();