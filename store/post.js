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
            Authorization: `Bearer ${token}`
          },
          body: fd
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    }
  }
}