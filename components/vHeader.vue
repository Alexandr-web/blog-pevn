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
            <nuxt-link class="header__list-link" :to="item.link">
              {{ item.value }}
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