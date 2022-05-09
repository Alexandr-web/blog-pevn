<template>
  <div class="user-page__tab">
    <form
      class="user-form"
      action="POST"
      enctype="multipart/form-data"
      @submit.prevent="changeSettings"
    >
      <div class="user-form__field">
        <h3 class="user-form__field-title">Имя</h3>
        <input
          class="user-form__input"
          type="text"
          placeholder="Имя"
          v-model.trim="$v.name.$model"
        />
      </div>
      <div class="user-form__field">
        <h3 class="user-form__field-title">Email</h3>
        <input
          class="user-form__input"
          type="text"
          placeholder="Email"
          v-model.trim="$v.email.$model"
        />
      </div>
      <div class="user-form__field">
        <h3 class="user-form__field-title">Пароль</h3>
        <input
          class="user-form__input"
          type="password"
          placeholder="Пароль"
          v-model.trim="$v.password.$model"
        />
      </div>
      <div class="user-form__field user-form__field-center">
        <label
          class="user-form__area-file"
          for="avatar"
          :class="{
            'user-form__area-file--success': avatar.file instanceof File,
          }"
        >
          <input
            class="user-form__file"
            type="file"
            accept="image/jpeg,image/png,image/gif"
            id="avatar"
            @change="loadFile($event)"
          />
          <span class="user-form__file-text">{{ textAreaFile }}</span>
        </label>
      </div>
      <div class="user-form__field user-form__field-center">
        <button class="user-form__submit" type="submit">Изменить</button>
      </div>
    </form>
  </div>
</template>

<script>
import { minLength, email } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      avatar: {
        file: {},
      },
      textAreaFile: "Загрузить аватар",
      File: Object,
    };
  },
  validations: {
    name: {
      minLength: minLength(6),
    },
    email: {
      email
    },
    password: {
      minLength: minLength(6)
    },
  },
  mounted() {
    this.File = File;
  },
  methods: {
    loadFile(e) {
      if (window.FileReader) {
        const target = e.currentTarget;
        const file = target.files[0];

        if (file) {
          const reader = new FileReader();

          reader.readAsDataURL(file);
          reader.addEventListener("load", () => {
            this.avatar.file = file;
            this.textAreaFile = `Файл ${file.name} загружен`;
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
        }
      } else {
        this.$emit("setAlert", {
          type: "error",
          title: "Ошибка",
          show: true,
          desc: "Ваш браузер устарел и не поддерживает FileReader, пожалуйста установите современный и повторите попытку",
        });

        this.textAreaFile = "Повторите попытку";
      }
    },
    async changeSettings() {
      try {
        this.$v.$touch();

        if (
          !this.$v.$invalid ||
          this.avatar.file instanceof File
        ) {
          const fd = new FormData();
          const token = this.$store.getters["auth/getToken"];

          this.name && fd.append("name", this.name);
          this.email && fd.append("email", this.email);
          this.password && fd.append("password", this.password);
          this.avatar.file instanceof File &&
            fd.append("avatar", this.avatar.file);

          const res = await this.$store.dispatch("user/changeSettings", {
            fd,
            token,
          });

          if (![400, 500, 404, 403].includes(res.status)) {
            this.$emit("setAlert", {
              type: "success",
              title: "Успешно",
              desc: res.message,
              show: true,
            });
          } else {
            this.$emit("setAlert", {
              type: "error",
              title: "Ошибка",
              desc: res.message,
              show: true,
            });
          }
        } else {
          this.$emit("setAlert", {
            type: "warning",
            title: "Внимание",
            desc: "Данные должны быть заполнены правильно",
            show: true,
          });
        }
      } catch (err) {
        this.$emit("setAlert", {
          type: "error",
          title: "Ошибка",
          desc: `Произошла ошибка сервера: ${err}`,
          show: true,
        });

        throw err;
      }
    },
  },
};
</script>