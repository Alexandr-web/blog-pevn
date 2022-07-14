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
      <h1 class="title">
        Создание поста
      </h1>
      <vFormCreatePost
        :pending="pending"
        @setAlert="setAlert"
        @createPost="createPost"
      />
    </div>
  </div>
</template>

<script>
  import vFormCreatePost from "@/components/vFormCreatePost";
  import vAlert from "@/components/vAlert";

  export default {
    name: "CreatePostPage",
    components: {
      vFormCreatePost,
      vAlert,
    },
    layout: "default",
    middleware: "checkAuth",
    data() {
      return {
        pending: false,
        alertData: {
          type: "",
          title: "",
          desc: "",
          show: false,
        },
      };
    },
    methods: {
      setAlert(options) {
        this.alertData = options;
      },
      createPost({ title, message, files, }) {
        if ([title, message, files.length].some(Boolean)) {
          const fd = new FormData();
          const token = this.$store.getters["auth/getToken"];

          fd.append("title", title);
          fd.append("message", message);

          files.map((image) => fd.append("files", image.file));

          const res = this.$store.dispatch("post/create", { fd, token, });

          this.pending = true;

          res
            .then(({ status, message: m, }) => {
              this.pending = false;
              
              if (![400, 500, 404, 403].includes(status)) {
                this.setAlert({
                  type: "success",
                  title: "Успешно",
                  desc: m,
                  show: true,
                });

                this.$router.push("/");
              } else {
                this.setAlert({
                  type: "error",
                  title: "Ошибка",
                  desc: m,
                  show: true,
                });
              }
            })
            .catch((err) => {
              this.setAlert({
                title: "Ошибка",
                type: "error",
                desc: `Произошла ошибка сервера: ${err}`,
                show: true,
              });
              throw err;
            });
        } else {
          this.setAlert({
            title: "Внимание",
            type: "warning",
            desc: "Хотя бы одно поле должно быть заполнено",
            show: true,
          });
        }
      },
      hideAlert() {
        this.alertData.show = false;
      },
    },
  };
</script>