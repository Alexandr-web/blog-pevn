<template>
  <li class="post" v-if="Object.keys(user).length">
    <header class="post__header">
      <div class="post__block post__user-info">
        <div class="post__user-image-block">
          <img
            class="post__user-image"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4dl15Q34O71yXw6fdqw312PJ5jGMbPE65_tE3jU8e57jW2-knKIm6ESchWhLoMOJhMLc&usqp=CAU"
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
        <li
          class="post__image"
          v-for="(image, index) in post.images"
          :key="index"
        >
          <img
            class="post__image-item"
            :src="require(`@/postsImages/${image}`)"
          />
        </li>
      </ul>
      <p class="post__message" v-if="post.message">{{ post.message }}</p>
    </main>
    <footer class="post__footer">
      <div class="post__controls">
        <button class="post__btn post__like">
          Нравится
          <span class="post__like-count">{{ post.likes }}</span>
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
      isValidUser: false,
    };
  },
  async fetch() {
    try {
      const userOfPost = await this.$store.dispatch(
        "auth/getUser",
        this.post.userId
      );
      const currentUser = await this.$store.dispatch("auth/getUser");

      this.isValidUser = currentUser.dataValues.id === userOfPost.user.id;
      this.user = userOfPost.user;
    } catch (err) {
      throw err;
    }
  },
  methods: {
    getValidDate(dateStr) {
      const date = new Date(dateStr);

      return `
      ${date.getDate() >= 9 ? date.getDate() : "0" + date.getDate()}.${
        date.getMonth() + 1 >= 9
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1)
      }.${date.getFullYear()}, 
      ${date.getHours() >= 9 ? date.getHours() : "0" + date.getHours()}:${
        date.getMinutes() >= 9 ? date.getMinutes() : "0" + date.getMinutes()
      }`;
    },
  },
};
</script>