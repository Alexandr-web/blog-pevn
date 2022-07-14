<template>
  <form
    class="form-create"
    enctype="multipart/form-data"
    method="POST"
    @submit.prevent="$emit('editPost')"
  >
    <div class="form-create__field">
      <input
        v-model.trim="title"
        class="form-create__input form-create__input-title"
        type="text"
        placeholder="Заголовок"
      />
    </div>
    <div class="form-create__field">
      <textarea
        v-model.trim="message"
        placeholder="Описание"
        class="form-create__input form-create__input-message"
      ></textarea>
    </div>
    <div class="form-create__field form-create__field-column-center">
      <label
        class="form-create__area-file"
        for="images"
        :class="{ 'form-create__area-file--success': files.length }"
      >
        <input
          id="images"
          class="form-create__input-file"
          type="file"
          accept="image/jpeg,image/png,image/gif"
          multiple
          @change="loadImages($event)"
        />
        <span class="form-create__file-text">{{ textAreaFile }}</span>
        <img
          v-if="files.length"
          class="form-create__check-mark"
          :src="require('@/static/icons/check.svg')"
          alt=""
        />
      </label>
      <ul
        v-if="files.length"
        class="form-create__files"
      >
        <li
          v-for="(file, index) in files"
          :key="index"
          class="form-create__files-item"
        >
          <img
            class="form-create__files-image"
            :src="typeof file === 'string' ? file : file.src"
            alt=""
          />
          <div
            v-if="file.file"
            class="form-create__files-name"
            :title="file.file.name"
          >
            {{ file.file.name }}
          </div>
          <button
            class="form-create__files-remove"
            type="button"
            @click="removeFile(index)"
          ></button>
        </li>
      </ul>
    </div>
    <div class="form-create__field form-create__field-center">
      <button
        class="form-create__submit"
        type="submit"
        :disabled="pending"
      >
        Изменить
      </button>
    </div>
  </form>
</template>

<script>
  export default {
    name: "FormEditComponent",
    props: {
      post: {
        type: Object,
        required: true,
      },
      pending: {
        type: Boolean,
        required: true,
      },
      files: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        textAreaFile: "Загрузить изображения",
        title: "",
        message: "",
      };
    },
    mounted() {
      this.title = this.post.title;
      this.message = this.post.message;
    },
    methods: {
      loadImages(e) {
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
                this.$emit("addFile", {
                  ...image,
                  src: reader.result,
                });

                this.textAreaFile = `Загруженных файлов: ${
                  this.files.filter((f) => typeof f !== "string").length
                }`;
              });
              reader.addEventListener("error", () => {
                this.$emit("setAlert", {
                  type: "error",
                  title: "Ошибка",
                  desc: `Произошла ошибка: ${reader.error}`,
                  show: true,
                });

                throw reader.error;
              });
            });
          }
        } else {
          this.$emit("setAlert", {
            type: "error",
            title: "Ошибка",
            desc: "Ваш браузер устарел и не поддерживает FileReader, пожалуйста установите современный и повторите попытку",
            show: true,
          });

          this.textAreaFile = "Повторите попытку";
        }
      },
      removeFile(index) {
        this.$emit("setFiles", this.files.filter((file, idx) => idx !== index));
      },
    },
  };
</script>