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
        <h2 class="auth__title">Регистрация</h2>
        <form class="auth__form" @submit.prevent="registration">
          <div class="auth__form-field">
            <input
              class="auth__form-input"
              type="text"
              placeholder="Имя"
              name="name"
              v-model.trim="$v.name.$model"
            />
            <div
              class="auth__form-valid-field"
              :class="{ 'invalid-bg': $v.name.$invalid }"
            ></div>
          </div>
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
              :class="{ 'invalid-bg': $v.email.$invalid }"
            ></div>
          </div>
          <div class="auth__form-field">
            <input
              class="auth__form-input"
              type="password"
              autocomplete="on"
              placeholder="Пароль"
              name="password"
              v-model="$v.password.$model"
            />
            <div
              class="auth__form-valid-field"
              :class="{ 'invalid-bg': $v.password.$invalid }"
            ></div>
          </div>
          <div class="auth__form-field">
            <input
              class="auth__form-input"
              type="password"
              autocomplete="on"
              placeholder="Повторите пароль"
              name="repeatPassword"
              v-model="$v.repeatPassword.$model"
            />
            <div
              class="auth__form-valid-field"
              :class="{ 'invalid-bg': $v.repeatPassword.$invalid }"
            ></div>
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
import {
  required,
  minLength,
  maxLength,
  email,
  sameAs,
} from "vuelidate/lib/validators";

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
      alertData: {
        type: "",
        title: "",
        desc: "",
        show: false,
      },
    };
  },
  validations: {
    name: {
      required,
      minLength: minLength(6),
      maxLength: maxLength(25),
    },
    email: {
      email,
      required,
    },
    password: {
      required,
      minLength: minLength(4),
    },
    repeatPassword: {
      required,
      sameAs: sameAs("password"),
    },
  },
  methods: {
    registration() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        const fd = {
          email: this.email,
          password: this.password,
          name: this.name,
        };

        const res = this.$store.dispatch("auth/registration", fd);

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
            this.alertData = {
              type: "error",
              title: "Ошибка",
              desc: `Произошла ошибка сервера: ${err}`,
              show: true,
            };

            throw err;
          });
      } else {
        this.alertData = {
          type: "warning",
          title: "Внимание",
          desc: "Все поля формы должны быть заполнены",
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