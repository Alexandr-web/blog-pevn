<template>
  <div class="user-page__tab">
    <form
      class="user-form"
      action="POST"
      enctype="multipart/form-data"
      @submit.prevent="changeSettings"
    >
      <h4 class="user-form__subtitle">
        Пользовательские данные
      </h4>
      <div class="user-form__field">
        <h3 class="user-form__field-title">
          Имя
        </h3>
        <input
          v-model.trim="$v.name.$model"
          class="user-form__input"
          type="text"
          placeholder="Имя"
        />
      </div>
      <div class="user-form__field">
        <h3 class="user-form__field-title">
          Email
        </h3>
        <input
          v-model.trim="$v.email.$model"
          class="user-form__input"
          type="text"
          placeholder="Email"
        />
      </div>
      <div class="user-form__field">
        <h3 class="user-form__field-title">
          Пароль
        </h3>
        <input
          v-model.trim="$v.password.$model"
          class="user-form__input"
          type="password"
          autocomplete="on"
          placeholder="Пароль"
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
            id="avatar"
            class="user-form__file"
            type="file"
            accept="image/jpeg,image/png,image/gif"
            @change="loadFile($event)"
          />
          <span class="user-form__file-text">{{ textAreaFile }}</span>
        </label>
      </div>
      <h4 class="user-form__subtitle">
        Тема сайта
      </h4>
      <div class="user-form__field user-form__field-row-center">
        <label
          class="user-form__label-theme"
          for="darkTheme"
        >
          <input
            id="darkTheme"
            class="user-form__radio"
            type="radio"
            name="theme"
            value="dark"
            :checked="theme === 'dark'"
            @change="setTheme('dark')"
          />
          <span class="user-form__radio-text">Темная</span>
        </label>
        <label
          class="user-form__label-theme"
          for="lightTheme"
        >
          <input
            id="lightTheme"
            class="user-form__radio"
            type="radio"
            name="theme"
            value="light"
            :checked="theme === 'light'"
            @change="setTheme('light')"
          />
          <span class="user-form__radio-text">Светлая</span>
        </label>
      </div>
      <div class="user-form__field user-form__field-row-center">
        <button
          class="user-form__submit"
          type="submit"
        >
          Изменить
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import { minLength, email, } from "vuelidate/lib/validators";

  export default {
    name: "UserSettingsComponent",
    data() {
      return {
        name: "",
        email: "",
        password: "",
        avatar: { file: {}, },
        theme: "dark",
        textAreaFile: "Загрузить аватар",
        File: Object,
      };
    },
    validations: {
      name: { minLength: minLength(6), },
      email: { email, },
      password: { minLength: minLength(6), },
    },
    mounted() {
      this.File = File;
      this.theme = localStorage.getItem("theme");
    },
    methods: {
      setTheme(theme) {
        this.theme = theme;
        document.body.dataset.theme = theme;
      },
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
          localStorage.setItem("theme", this.theme);

          this.$v.$touch();
          
          if (!this.$v.$invalid || this.avatar.file instanceof File) {
            const fd = new FormData();
            const token = this.$store.getters["auth/getToken"];
            const dataSettings = {
              name: this.name,
              email: this.email,
              password: this.password,
              avatar: this.avatar.file,
            };

            Object.keys(dataSettings).filter((key) => {
              if (key === "avatar") {
                return dataSettings[key] instanceof File;
              }

              return dataSettings[key];
            }).map((key) => fd.append(key, dataSettings[key]));

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