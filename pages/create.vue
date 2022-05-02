<template>
  <div class="page">
    <div class="container">
      <div class="alerts">
        <vAlert
          v-for="(alert, index) in alerts"
          :key="index"
          :type="alert.type"
          :title="alert.title"
          :desc="alert.desc"
        />
      </div>
      <h1 class="title">Создание поста</h1>
      <vFormCreatePost @setAlert="setAlert" @createPost="createPost" />
    </div>
  </div>
</template>

<script>
import vFormCreatePost from "@/components/vFormCreatePost";
import vAlert from "@/components/vAlert";

export default {
  layout: "default",
  middleware: "checkAuth",
  data() {
    return {
      alerts: [],
    };
  },
  components: {
    vFormCreatePost,
    vAlert,
  },
  methods: {
    setAlert(options) {
      this.alerts.unshift(options);
    },
    async createPost({ title, message, files }) {
      try {
        const fd = new FormData();
        const token = this.$store.getters["auth/getToken"];
        const user = await this.$store.dispatch("auth/getUser");

        fd.append("userId", user.user.id);
        fd.append("title", title);
        fd.append("message", message);

        files.map((image) => fd.append("files", image.file));

        const res = await this.$store.dispatch("post/create", { fd, token });

        if (![400, 500, 404, 403].includes(res.status)) {
          this.alerts.unshift({
            type: "success",
            title: "Успешно",
            desc: res.message,
          });

          this.$router.push("/");
        } else {
          this.alerts.unshift({
            type: "error",
            title: "Ошибка",
            desc: res.message,
          });
        }
      } catch (err) {
        this.alerts.unshift({
          title: "Ошибка",
          type: "error",
          desc: `Произошла ошибка сервера: ${err}`,
        });

        throw err;
      }
    },
  },
};
</script>