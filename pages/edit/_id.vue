<template>
  <div class="page">
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
    <div class="container" v-if="Object.keys(post).length">
      <h1 class="title">Редактирование поста</h1>
      <vFormEditPost
        :post="post"
        :pending="pending"
        :files="files"
        @setFiles="setFiles"
        @addFile="addFile"
        @setAlert="setAlert"
        @editPost="editPost"
      />
    </div>
  </div>
</template>

<script>
import getValidURLImageForImagesPostMixin from "@/mixins/getValidURLImageForImagesPostMixin";
import vAlert from "@/components/vAlert";
import vFormEditPost from "@/components/vFormEditPost";

export default {
  layout: "default",
  middleware: "checkAuth",
  mixins: [getValidURLImageForImagesPostMixin],
  validate({ store, params }) {
    const { id } = params;

    if (!/^\d+$/g.test(id)) {
      return;
    }

    const getCurrentUser = store.dispatch("auth/getUser");
    const getPost = store.dispatch("post/asyncPost", id);

    return Promise.all([getPost, getCurrentUser])
      .then(([dataPost, dataUser]) => {
        const { post } = dataPost;
        const { user } = dataUser;

        return Object.keys(post).length && post.userId === user.id;
      })
      .catch((err) => {
        throw err;
      });
  },
  data() {
    return {
      pending: false,
      post: {},
      files: [],
      alertData: {
        title: "",
        desc: "",
        type: "",
        show: false,
      },
    };
  },
  async fetch() {
    try {
      const { id } = this.$route.params;
      const getPost = await this.$store.dispatch("post/asyncPost", id);

      this.post = getPost.post;

      if (getPost.post.images.length) {
        getPost.post.images.map((image) => {
          this.getValidURLImageForImagesPost(image)
            .then((val) => this.files.push(val))
            .catch((err) => {
              throw err;
            });
        });
      } else {
        this.files = getPost.post.images;
      }
    } catch (err) {
      throw err;
    }
  },
  methods: {
    addFile(file) {
      this.files.push(file);
    },
    setFiles(files) {
      this.files = files;
    },
    setAlert(options) {
      this.alertData = options;
    },
    editPost() {
      const { title, message } = this.post;

      if ([title, message, this.files.length].some(Boolean)) {
        const fd = new FormData();
        const { id } = this.$route.params;

        fd.append("title", this.post.title);
        fd.append("message", this.post.message);
        fd.append(
          "images",
          JSON.stringify(this.files.filter((file) => typeof file === "string"))
        );

        this.files
          .filter((file) => typeof file !== "string")
          .map((file) => fd.append("files", file.file));

        const token = this.$store.getters["auth/getToken"];
        const res = this.$store.dispatch("post/edit", {
          fd,
          token,
          postId: id,
        });

        this.pending = true;

        res
          .then(({ message, status }) => {
            this.pending = false;

            if (![400, 500, 404, 403].includes(status)) {
              this.setAlert({
                type: "success",
                title: "Успешно",
                desc: message,
                show: true,
              });

              this.$router.push("/");
            } else {
              this.setAlert({
                type: "error",
                title: "Ошибка",
                desc: message,
                show: true,
              });
            }
          })
          .catch((err) => {
            this.setAlert({
              type: "error",
              title: "Ошибка",
              desc: `Произошла ошибка сервера: ${err}`,
              show: true,
            });

            throw err;
          });
      } else {
        this.setAlert({
          type: "warning",
          title: "Внимание",
          desc: "Хотя бы ожно поле должно быть заполнено",
          show: true,
        });
      }
    },
    hideAlert() {
      this.alertData.show = false;
    },
  },
  components: {
    vAlert,
    vFormEditPost,
  },
};
</script>