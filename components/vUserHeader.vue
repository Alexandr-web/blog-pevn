<template>
  <header class="user-page__header">
    <div class="user-page__info">
      <div class="user-page__info-avatar">
        <img
          class="user-page__info-avatar-image"
          :src="userInfo.avatar"
          alt=""
        />
      </div>
      <div class="user-page__info-person">
        <h2 class="user-page__info-name">{{ userInfo.name }}</h2>
        <h3 class="user-page__info-email">{{ userInfo.email }}</h3>
      </div>
    </div>
    <nav class="user-page__navbar" v-if="isCurrentUser">
      <ul class="user-page__navbar-list">
        <li class="user-page__navbar-list-item">
          <nuxt-link
            class="user-page__navbar-list-link"
            :to="`/profile/${userInfo.id}?tab=info`"
            exact-active-class="active-user-link"
          >
            Личная информация
          </nuxt-link>
        </li>
        <li class="user-page__navbar-list-item" v-if="isCurrentUser">
          <nuxt-link
            class="user-page__navbar-list-link"
            :to="`/profile/${userInfo.id}?tab=settings`"
            exact-active-class="active-user-link"
          >
            Настройки
          </nuxt-link>
        </li>
        <li class="user-page__navbar-list-item" v-if="isCurrentUser">
          <nuxt-link
            class="user-page__navbar-list-link"
            :to="`/profile/${userInfo.id}?tab=delete`"
            exact-active-class="active-user-link"
          >
            Удаление аккаунта
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import getValidURLImageForAvatarMixin from "@/mixins/getValidURLImageForAvatarMixin";

export default {
  mixins: [getValidURLImageForAvatarMixin],
  props: {
    isCurrentUser: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      userInfo: {},
    }
  },
  async fetch() {
    try {
      Object.keys(this.user).map(key => this.userInfo[key] = this.user[key]);
      this.userInfo.avatar = await this.getValidURLImageForAvatar(this.userInfo.avatar);
    } catch (err) {
      throw err;
    }
  }
}
</script>