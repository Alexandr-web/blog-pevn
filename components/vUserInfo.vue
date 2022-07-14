<template>
  <div class="user-page__tab user-info">
    <div class="user-info__col">
      <h3 class="user-info__title">
        Имя
      </h3>
      <p
        class="user-info__desc"
        :title="user.name"
      >
        {{ user.name }}
      </p>
    </div>
    <div class="user-info__col">
      <h3 class="user-info__title">
        Почта
      </h3>
      <p
        class="user-info__desc"
        :title="user.email"
      >
        {{ user.email }}
      </p>
    </div>
    <div class="user-info__col">
      <h3 class="user-info__title">
        Количество постов
      </h3>
      <p
        class="user-info__desc"
        :title="posts.length"
      >
        {{ posts.length }}
      </p>
    </div>
    <div class="user-info__col">
      <h3 class="user-info__title">
        Дата регистрации
      </h3>
      <p
        class="user-info__desc"
        :title="user.createdAt"
      >
        {{ new Date(user.createdAt).toLocaleDateString() }}
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "UserInfoComponent",
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data() {
      return { posts: [], };
    },
    async fetch() {
      try {
        const res = await this.$store.dispatch("post/asyncPosts");

        if (res.ok) {
          this.posts = res.posts.filter(({ userId, }) => userId === this.user.id);
        }
      } catch (err) {
        throw err;
      }
    },
  };
</script>