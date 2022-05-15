<template>
  <div class="auth">
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
      <div class="auth__inner">
        <h2 class="auth__title">Вход в аккаунт</h2>
        <form class="auth__form" @submit.prevent="login">
          <div class="auth__form-field">
            <input
              class="auth__form-input"
              type="text"
              placeholder="Эл. почта"
              name="email"
              v-model.trim="$v.email.$model"
            />
            <div
              class="auth__form-valid-field"
              :class="{ 'invalid-bg': $v.email.$error }"
            ></div>
          </div>
          <div class="auth__form-field">
            <input
              class="auth__form-input"
              type="password"
              autocomplete="on"
              placeholder="Пароль"
              name="password"
              v-model.trim="$v.password.$model"
            />
            <div
              class="auth__form-valid-field"
              :class="{ 'invalid-bg': $v.password.$error }"
            ></div>
          </div>
          <button class="auth__form-submit" type="submit" :disabled="pending">
            Войти
          </button>
        </form>
        <div class="auth__additionally">
          <p class="auth__additionally-desc">
            Нет аккаунта?
            <nuxt-link class="auth__additionally-link" to="/auth/registration">
              Зарегистрироваться
            </nuxt-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vAlert from "@/components/vAlert";
import { required, minLength, email } from "vuelidate/lib/validators";

export default {
  layout: "empty",
  middleware: "checkAlreadyAuth",
  data() {
    return {
      email: "",
      password: "",
      pending: false,
      alertData: {
        type: "",
        title: "",
        desc: "",
        show: false,
      },
    };
  },
  validations: {
    password: {
      required,
      minLength: minLength(4),
    },
    email: {
      required,
      email,
    },
  },
  methods: {
    login() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        const fd = {
          email: this.email,
          password: this.password,
        };

        const res = this.$store.dispatch("auth/login", fd);

        this.pending = true;

        res
          .then(({ message, status }) => {
            this.pending = false;

            if (![400, 500, 404].includes(status)) {
              this.alertData = {
                type: "success",
                title: "Успешно",
                desc: message,
                show: true,
              };

              this.$router.push("/");
            } else {
              this.alertData = {
                type: "error",
                title: "Ошибка",
                desc: message,
                show: true,
              };
            }
          })
          .catch((err) => {
            throw err;
          });
      } else {
        this.alertData = {
          type: "warning",
          title: "Внимание",
          desc: "Все поля формы должны быть заполнены правильно",
          show: true,
        };
      }
    },
    hideAlert() {
      this.alertData.show = false;
    },
  },
  components: {
    vAlert,
  },
};
</script>