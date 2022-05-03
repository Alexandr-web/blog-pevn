import host from "../server/host";

export default {
  actions: {
    async changeSettings({ }, { fd, token }) {
      try {
        const res = await fetch(`${host}/user/update`, {
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
    async deleteAccount({ }, token) {
      try {
        const res = await fetch(`${host}/user/delete`, {
          method: "DELETE",
          headers: {
            "Accept-Type": "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`
          },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    }
  }
}