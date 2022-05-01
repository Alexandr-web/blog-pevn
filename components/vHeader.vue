<template>
  <header class="header">
    <div class="container">
      <nav class="header__nav">
        <nuxt-link class="header__logo" to="/">BlogPevn</nuxt-link>
        <ul class="header__list">
          <li class="header__list-item">
            <nuxt-link
              class="header__list-link"
              to="/"
              exact-active-class="active-link"
            >
              Главная
            </nuxt-link>
          </li>
          <li class="header__list-item">
            <nuxt-link
              class="header__list-link"
              :to="`/profile/${userId}`"
              active-class="active-link"
            >
              Профиль
            </nuxt-link>
          </li>
          <li class="header__list-item">
            <nuxt-link
              class="header__list-link header__list-create"
              to="/create"
            >
              Создать
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      userId: null,
    };
  },
  async fetch() {
    try {
      const currentUser = await this.$store.dispatch("auth/getUser");

      this.userId = currentUser.dataValues.id;
    } catch (err) {
      throw err;
    }
  },
};
</script>