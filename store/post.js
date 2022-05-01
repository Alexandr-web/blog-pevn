import host from "../server/host";

export default {
  actions: {
    async asyncPosts() {
      try {
        const res = await fetch(`${host}/post`, {
          method: "GET",
          headers: {
            "Accept-Type": "application/json"
          }
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    async create({ }, { fd, token }) {
      try {
        const res = await fetch(`${host}/post/create`, {
          method: "POST",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`
          },
          body: fd
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    async like({ }, { token, fd }) {
      try {
        const res = await fetch(`${host}/post/like`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`
          },
          body: JSON.stringify(fd)
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    }
  }
}