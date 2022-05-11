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

    async getSlicePosts({}, fd) {
      try {
        const res = await fetch(`${host}/post/pagination`, {
          method: "POST",
          headers: {
            "Accept-Type": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(fd)
        });

        return res.json();
      } catch(err) {
        throw err;
      }
    },

    async asyncPost({}, id) {
      try {
        const res = await fetch(`${host}/post/${id}`, {
          method: "GET",
          headers: {
            "Accept-Type": "application/json"
          }
        });

        return res.json();
      } catch(err) {
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
    },

    async edit({}, { token, fd, postId }) {
      try {
        const res = await fetch(`${host}/post/edit/${postId}`, {
          method: "POST",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`
          },
          body: fd
        });

        return res.json();
      } catch(err) {
        throw err;
      }
    },

    async remove({}, { token, postId }) {
      try {
        const res = await fetch(`${host}/post/remove/${postId}`, {
          method: "DELETE",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        return res.json();
      } catch(err) {
        throw err;
      }
    }
  }
}