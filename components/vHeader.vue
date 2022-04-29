<template>
  <header class="header">
    <div class="container">
      <nav class="header__nav">
        <nuxt-link class="header__logo" to="/">BlogPevn</nuxt-link>
        <ul class="header__list">
          <li
            class="header__list-item"
            v-for="(item, index) in listLinks"
            :key="index"
          >
            <nuxt-link
              class="header__list-link"
              :to="item.link"
              exact-active-class="active-link"
            >
              {{ item.value }}
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
      listLinks: [
        { link: "/", value: "Главная" },
        { link: "/profile", value: "Профиль" },
        { link: "/settings", value: "Настройки" },
      ],
    };
  },
};
</script>