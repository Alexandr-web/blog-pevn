const Cookie = require("cookie");

import host from "../server/host";
import jsCookie from "js-cookie";
import jwtDecode from "jwt-decode";

export default {
  state() {
    return {
      token: null
    }
  },
  getters: {
    getToken: state => state.token
  },
  mutations: {
    setToken(state, val) {
      state.token = val;

      jsCookie.set("token", val);
    },
    clearToken(state) {
      state.token = null;

      jsCookie.remove("token");
    }
  },
  actions: {
    async registration({ }, fd) {
      try {
        const res = await fetch(`${host}/auth/registration`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept-Type": "application/json",
          },
          body: JSON.stringify(fd)
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    async login({ commit }, fd) {
      try {
        const res = await fetch(`${host}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept-Type": "application/json",
          },
          body: JSON.stringify(fd)
        });

        const data = await res.json();

        if (data.ok && data.token) {
          commit("setToken", data.token.replace(/^Bearer /, ""));
        }

        return data;
      } catch (err) {
        throw err;
      }
    },

    async autoLogin({ commit }) {
      try {
        const cookieStr = process.browser ? document.cookie : this.app.context.req.headers.cookie || "";
        const findToken = Cookie.parse(cookieStr);

        if (findToken) {
          const isValidToken = tkn => {
            if (!tkn) {
              return false;
            }

            const tokenData = jwtDecode(tkn) || {};
            const expires = tokenData.exp || 0;

            return (new Date().getTime() / 1000) < expires;
          }

          return isValidToken(findToken.token) ? commit("setToken", findToken.token) : commit("clearToken");
        } else {
          return commit("clearToken");
        }
      } catch (err) {
        throw err;
      }
    },

    async getUser({ }, id) {
      try {
        const sendReq = async currentId => {
          const res = await fetch(`${host}/auth/user/${currentId}`, {
            method: "GET",
            headers: {
              "Accept-Type": "application/json"
            }
          });

          return res.json();
        }

        if (id) {
          return sendReq(id);
        } else {
          const cookieStr = process.browser ? document.cookie : this.app.context.req.headers.cookie || "";
          const findToken = Cookie.parse(cookieStr);
          const res = findToken ? jwtDecode(findToken.token) || {} : {};

          if (Object.keys(res).length) {
            return sendReq(res.dataValues.id);
          } else {
            return {};
          }
        }
      } catch (err) {
        throw err;
      }
    }
  }
}