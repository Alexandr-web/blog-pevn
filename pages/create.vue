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
      pending: false,
    };
  },
  components: {
    vFormCreatePost,
    vAlert,
  },
  methods: {
    setAlert(options) {
      this.alerts.push(options);
    },
    createPost({ title, message, files }) {
      const fd = new FormData();
      const token = this.$store.getters["auth/getToken"];

      this.$store
        .dispatch("auth/getUser")
        .then((user) => {
          fd.append("userId", user.dataValues.id);
          fd.append("title", title);
          fd.append("message", message);

          files.map((image) => fd.append("files", image.file));

          const res = this.$store.dispatch("post/create", { fd, token });

          this.pending = true;

          res
            .then(({ ok }) => {
              console.log(ok);
            })
            .catch((err) => {
              throw err;
            });
        })
        .catch((err) => {
          this.alerts.push({
            title: "Ошибка",
            type: "error",
            desc: `Произошла ошибка сервера: ${err}`,
          });

          throw err;
        });
    },
  },
};
</script>