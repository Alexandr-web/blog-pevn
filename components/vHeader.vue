<template>
  <header class="header" :class="{ 'header--show': show }">
    <div class="container">
      <nav class="header__nav">
        <nuxt-link class="header__logo" to="/">BlogPevn</nuxt-link>
        <ul class="header__list">
          <li class="header__list-item">
            <nuxt-link
              class="header__list-link header__list-create"
              to="/create"
            >
              Создать
            </nuxt-link>
          </li>
          <li class="header__list-item header__list-item-avatar">
            <div
              class="header__list-avatar-block"
              @click="showSubMenu = !showSubMenu"
            >
              <img class="header__list-avatar" :src="user.avatar" alt="" />
            </div>
            <ul
              class="header__list-submenu"
              ref="submenu"
              :style="{ bottom: `-${this.heightSubmenu}px` }"
              :class="{ 'header__list-submenu--show': showSubMenu }"
            >
              <li class="header__list-submenu-item">
                <nuxt-link
                  class="header__list-submenu-link"
                  :to="`/profile/${user.id}?tab=info`"
                  @click.native="showSubMenu = false"
                >
                  Профиль
                </nuxt-link>
              </li>
              <li class="header__list-submenu-item">
                <nuxt-link
                  class="header__list-submenu-link"
                  :to="`/profile/${user.id}?tab=settings`"
                  @click.native="showSubMenu = false"
                >
                  Настройки
                </nuxt-link>
              </li>
              <li class="header__list-submenu-item">
                <nuxt-link
                  class="header__list-submenu-link"
                  :to="`/profile/${user.id}?tab=delete`"
                  @click.native="showSubMenu = false"
                >
                  Удаление
                </nuxt-link>
              </li>
              <li class="header__list-submenu-item header__list-submenu-logout">
                <button class="header__list-submenu-logout" @click="logout">
                  Выйти
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import getValidURLImageForAvatarMixin from "@/mixins/getValidURLImageForAvatarMixin";

export default {
  props: {
    show: Boolean
  },
  mixins: [getValidURLImageForAvatarMixin],
  data() {
    return {
      user: {},
      heightSubmenu: 0,
      showSubMenu: false,
    };
  },
  async fetch() {
    try {
      const currentUser = await this.$store.dispatch("auth/getUser");

      if (currentUser) {
        this.user = {
          ...currentUser.user,
          avatar: await this.getValidURLImageForAvatar(currentUser.user.avatar),
        };
      }
    } catch (err) {
      throw err;
    }
  },
  mounted() {
    this.heightSubmenu = this.$refs.submenu.offsetHeight + 15;
  },
  methods: {
    async logout() {
      try {
        this.$store.commit("auth/clearToken");
        await this.$router.push("/auth/login");
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>