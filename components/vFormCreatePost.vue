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
      <textarea
        v-model="message"
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
          @change="setFiles($event)"
        />
        <span class="form-create__file-text">{{ textAreaFile }}</span>
        <img
          class="form-create__check-mark"
          :src="require('@/static/icons/check.svg')"
          alt=""
          v-if="files.length"
        />
      </label>
      <ul class="form-create__files" v-if="files.length">
        <li
          v-for="(file, index) in files"
          :key="index"
          class="form-create__files-item"
        >
          <img class="form-create__files-image" :src="file.src" alt="" />
          <div class="form-create__files-name" :title="file.file.name">
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
      <button class="form-create__submit" type="submit">Создать</button>
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
      textAreaFile: "Загрузить изображение",
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

              this.textAreaFile = `Загруженных файлов: ${this.files.length}`;
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

        this.textAreaFile = "Повторите попытку";
      }
    },

    removeFile(index) {
      this.files = this.files.filter((file, idx) => idx !== index);
      this.textAreaFile = `Загруженных файлов: ${this.files.length}`;
    },
  },
};
</script>