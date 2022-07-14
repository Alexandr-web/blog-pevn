import jwtDecode from "jwt-decode";

const host = require("../server/host");
const Cookie = require("cookie");

export default {
  actions: {
    async changeSettings({ }, { fd, token, }) {
      try {
        const res = await fetch(`${host}/user/update`, {
          method: "POST",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
          body: fd,
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    async deleteAccount({ }, token) {
      try {
        const res = await fetch(`${host}/user/delete`, {
          method: "DELETE",
          headers: {
            "Accept-Type": "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    async getOne({ }, id) {
      try {
        const sendReq = async (userId) => {
          const res = await fetch(`${host}/user/api/${userId}`, {
            method: "GET",
            headers: { "Accept-Type": "application/json", },
          });

          return res.json();
        };

        if (id) {
          return sendReq(id);
        }
        const cookieStr = process.browser ? document.cookie : this.app.context.req.headers.cookie || "";
        const findToken = Cookie.parse(cookieStr);
        const res = findToken ? jwtDecode(findToken.token) || {} : {};

        if (Object.keys(res).length) {
          return sendReq(res.dataValues.id);
        }
        return {};
      } catch (err) {
        throw err;
      }
    },
  },
};