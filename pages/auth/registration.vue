<template>
  <div class="auth">
    <div class="container">
      <div class="alerts">
        <vAlert
          v-for="(alert, index) in alerts"
          :title="alert.title"
          :desc="alert.desc"
          :type="alert.type"
          :key="index"
        />
      </div>
      <div class="auth__inner">
        <h2 class="auth__title">Регистрация</h2>
        <form class="auth__form" @submit.prevent="registration">
          <div class="auth__form-field">
            <input
              class="auth__form-input"
              type="text"
              placeholder="Имя"
              name="name"
              v-model="name"
            />
            <div class="auth__form-valid-field"></div>
          </div>
          <div class="auth__form-field">
            <input
              class="auth__form-input"
              type="text"
              placeholder="Эл. почта"
              name="email"
              v-model="email"
            />
            <div class="auth__form-valid-field"></div>
          </div>
          <div class="auth__form-field">
            <input
              class="auth__form-input"
              type="password"
              placeholder="Пароль"
              name="password"
              v-model="password"
            />
            <div class="auth__form-valid-field"></div>
          </div>
          <div class="auth__form-field">
            <input
              class="auth__form-input"
              type="password"
              placeholder="Повторите пароль"
              name="repeatPassword"
              v-model="repeatPassword"
            />
            <div class="auth__form-valid-field"></div>
          </div>
          <button class="auth__form-submit" type="submit" :disabled="pending">
            Зарегистрироваться
          </button>
        </form>
        <div class="auth__additionally">
          <p class="auth__additionally-desc">
            Есть аккаунт?
            <nuxt-link class="auth__additionally-link" to="/auth/login">
              Войти
            </nuxt-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vAlert from "@/components/vAlert";

export default {
  layout: "empty",
  middleware: "checkAlreadyAuth",
  data() {
    return {
      email: "",
      password: "",
      repeatPassword: "",
      name: "",
      pending: false,
      alerts: [],
    };
  },
  methods: {
    registration() {
      const fd = {
        email: this.email,
        password: this.password,
        name: this.name,
      };

      if (!Object.values(fd).every(Boolean)) {
        this.alerts.push({
          type: "warning",
          title: "Внимание",
          desc: "Все поля формы должны быть заполнены",
        });

        return;
      }

      const res = this.$store.dispatch("auth/registration", fd);

      res
        .then(({ ok, message, status }) => {
          this.pending = false;

          if (ok) {
            if (![400, 500, 404].includes(status)) {
              this.alerts.push({
                type: "success",
                title: "Успешно",
                desc: message,
              });
            } else {
              this.alerts.push({
                type: "error",
                title: "Ошибка",
                desc: message,
              });
            }
          }
        })
        .catch((err) => {
          this.alerts.push({
            type: "error",
            title: "Ошибка",
            desc: "Произошла ошибка сервера, попробуйте перезагрузить сайт",
          });

          throw err;
        });
    },
  },
  components: {
    vAlert,
  },
};
</script>