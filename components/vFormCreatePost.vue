<template>
  <form
    class="form-create"
    enctype="multipart/form-data"
    method="POST"
    @submit.prevent="$emit('createPost', { title, message, files })"
  >
    <div class="form-create__field">
      <input
        class="form-create__input form-create__input-title"
        type="text"
        placeholder="Заголовок"
        v-model="title"
      />
    </div>
    <div class="form-create__field">
      <label class="form-create__label" for="images">
        <input
          id="images"
          class="form-create__input form-create__input-file"
          type="file"
          accept="image/jpeg,image/png,image/gif"
          multiple
          @change="setFiles($event)"
        />
        <span class="form-create__file-text">Загрузить изображение</span>
      </label>
    </div>
    <div class="form-create__field">
      <textarea
        v-model="message"
        class="form-create__input form-create__input-message"
      ></textarea>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      files: [],
      message: "",
    };
  },
  methods: {
    setFiles(e) {
      if (window.FileReader) {
        const target = e.currentTarget;
        const files = target.files;

        if (files && files.length) {
          [...files].map((file) => {
            const reader = new FileReader();
            const image = {
              file,
              src: "",
            };

            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
              this.files.push({
                ...image,
                src: reader.result,
              });
            });
            reader.addEventListener("error", () => {
              this.$emit("setAlert", {
                type: "error",
                title: "Ошибка",
                desc: `Произошла ошибка: ${reader.error}`,
              });

              throw reader.error;
            });
          });
        } else {
          this.files = [];
        }
      } else {
        this.$emit("setAlert", {
          type: "error",
          title: "Ошибка",
          desc: "Ваш браузер устарел и не поддерживает FileReader, пожалуйста установите современный и повторите попытку",
        });
      }
    },
  },
};
</script>