<template>
  <div class="page">
    <div class="container">
      <div class="alerts">
        <vAlert
          v-if="
            Object.values(alertData)
              .filter((val) => val !== 'show')
              .every(Boolean)
          "
          :title="alertData.title"
          :desc="alertData.desc"
          :type="alertData.type"
          :show="alertData.show"
          @hide="hideAlert"
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
      alertData: {
        type: "",
        title: "",
        desc: "",
        show: false,
      },
    };
  },
  components: {
    vFormCreatePost,
    vAlert,
  },
  methods: {
    setAlert(options) {
      this.alertData = options;
    },
    async createPost({ title, message, files }) {
      try {
        if ([title, message, files.length].some(Boolean)) {
          const fd = new FormData();
          const token = this.$store.getters["auth/getToken"];
          const user = await this.$store.dispatch("auth/getUser");

          fd.append("userId", user.user.id);
          fd.append("title", title);
          fd.append("message", message);

          files.map((image) => fd.append("files", image.file));

          const res = await this.$store.dispatch("post/create", { fd, token });

          if (![400, 500, 404, 403].includes(res.status)) {
            this.setAlert({
              type: "success",
              title: "Успешно",
              desc: res.message,
              show: true,
            });

            this.$router.push("/");
          } else {
            this.setAlert({
              type: "error",
              title: "Ошибка",
              desc: res.message,
              show: true,
            });
          }
        } else {
          this.setAlert({
            title: "Внимание",
            type: "warning",
            desc: "Хотя бы одно поле должно быть заполнено",
            show: true,
          });
        }
      } catch (err) {
        this.setAlert({
          title: "Ошибка",
          type: "error",
          desc: `Произошла ошибка сервера: ${err}`,
          show: true,
        });

        throw err;
      }
    },
    hideAlert() {
      this.alertData.show = false;
    },
  },
};
</script>