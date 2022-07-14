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
        <h2 class="user-page__info-name">
          {{ userInfo.name }}
        </h2>
        <h3 class="user-page__info-email">
          {{ userInfo.email }}
        </h3>
      </div>
    </div>
    <nav
      v-if="isCurrentUser"
      class="user-page__navbar"
    >
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
        <li
          v-if="isCurrentUser"
          class="user-page__navbar-list-item"
        >
          <nuxt-link
            class="user-page__navbar-list-link"
            :to="`/profile/${userInfo.id}?tab=settings`"
            exact-active-class="active-user-link"
          >
            Настройки
          </nuxt-link>
        </li>
        <li
          v-if="isCurrentUser"
          class="user-page__navbar-list-item"
        >
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
    name: "UserHeaderComponent",
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
      return { userInfo: {}, };
    },
    async fetch() {
      this.getValidURLImageForAvatar(this.user.avatar).then((url) => {
        this.userInfo = { ...this.user, avatar: url, };
      }).catch((err) => {
        throw err;
      });
    },
  };
</script>