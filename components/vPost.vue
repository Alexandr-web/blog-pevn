<template>
  <li class="post" v-if="Object.keys(user).length">
    <header class="post__header">
      <div class="post__block post__user-info">
        <div class="post__user-image-block">
          <img
            class="post__user-image"
            :src="user.avatar"
            alt="Изображение пользователя"
          />
        </div>
        <h4 class="post__user-name">{{ user.name }}</h4>
      </div>
      <div class="post__block">
        <h6 class="post__date">{{ getValidDate(post.createdAt) }}</h6>
      </div>
    </header>
    <main class="post__main">
      <h2 class="post__title" v-if="post.title">{{ post.title }}</h2>
      <ul
        v-if="post.images.length"
        class="post__images"
        :class="{
          'post__images--even': post.images.length % 2 === 0,
          'post__images--odd':
            post.images.length > 1 && post.images.length % 2 !== 0,
        }"
      >
        <li class="post__image" v-for="(image, index) in images" :key="index">
          <img class="post__image-item" :src="image" />
        </li>
      </ul>
      <p class="post__message" v-if="post.message">{{ post.message }}</p>
    </main>
    <footer class="post__footer">
      <div class="post__controls">
        <button
          class="post__btn post__like"
          :class="{ 'active-like': isCurrentUserLike(post.likes) }"
          @click="$emit('like', post.id)"
        >
          Нравится
          <span class="post__like-count">{{ post.likes.length }}</span>
        </button>
        <nuxt-link
          class="post__btn post__edit"
          :to="`/edit/${post.userId}`"
          v-if="isValidUser"
        >
          Редактировать
        </nuxt-link>
      </div>
    </footer>
  </li>
</template>

<script>
import getValidURLImageForAvatar from "@/getValidURLImageForAvatar/index";

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      user: {},
      currentUser: {},
      isValidUser: false,
      images: [],
    };
  },
  async fetch() {
    try {
      const userOfPost = await this.$store.dispatch(
        "auth/getUser",
        this.post.userId
      );
      const currentUser = await this.$store.dispatch("auth/getUser");

      this.post.images.map((image) => {
        this.getValidURLImageForPost(image)
          .then((res) => this.images.push(res))
          .catch((err) => {
            throw err;
          });
      });

      this.isValidUser = currentUser.user.id === userOfPost.user.id;
      this.user = {
        ...userOfPost.user,
        avatar: await getValidURLImageForAvatar(userOfPost.user.avatar),
      };
      this.currentUser = currentUser.user;
    } catch (err) {
      throw err;
    }
  },
  methods: {
    async getValidURLImageForPost(image) {
      const url = await require(`@/postsImages/${image}`);

      return /^\/\_nuxt\//.test(url) ? url : "";
    },
    getValidDate(dateStr) {
      const date = new Date(dateStr);

      return `
      ${date.toLocaleDateString()}, 
      ${date.getHours() >= 9 ? date.getHours() : "0" + date.getHours()}:${
        date.getMinutes() >= 9 ? date.getMinutes() : "0" + date.getMinutes()
      }`;
    },
    isCurrentUserLike(likes) {
      return likes.findIndex((id) => this.currentUser.id === id) !== -1;
    },
  },
};
</script>