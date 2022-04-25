<template>
  <div class="auth">
    <div class="container">
      <div class="auth__inner">
        <h2 class="auth__title">Вход в аккаунт</h2>
        <form class="auth__form">
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
          <button class="auth__form-submit" type="submit">Войти</button>
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
export default {
  layout: "empty",
  data() {
    return {
      email: "",
      password: "",
    };
  },
};
</script>