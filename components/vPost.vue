<template>
  <li
    v-if="Object.keys(user).length"
    class="post"
  >
    <header class="post__header">
      <div class="post__block post__user-info">
        <div class="post__user-image-block">
          <img
            class="post__user-image"
            :src="user.avatar"
            alt="Изображение пользователя"
          />
        </div>
        <h4 class="post__user-name">
          <nuxt-link
            class="post__user-name-link"
            :to="`/profile/${user.id}`"
          >
            {{
              user.name
            }}
          </nuxt-link>
        </h4>
      </div>
      <div class="post__block">
        <h6 class="post__date">
          {{ getValidDate(post.createdAt) }}
        </h6>
      </div>
    </header>
    <main class="post__main">
      <h2
        v-if="post.title"
        class="post__title post__content-block"
      >
        {{ post.title }}
      </h2>
      <ul
        v-if="images.length"
        class="post__images post__content-block"
        :class="{
          'post__images--even': images.length % 2 === 0,
          'post__images--odd': images.length > 1 && images.length % 2 !== 0,
        }"
      >
        <li
          v-for="(image, index) in images"
          :key="index"
          class="post__image"
        >
          <img
            class="post__image-item"
            :src="image"
          />
        </li>
      </ul>
      <vShowFull v-if="post.message">
        <p
          slot="target"
          class="post__message post__content-block"
        >
          {{ post.message }}
        </p>
      </vShowFull>
    </main>
    <footer class="post__footer">
      <div class="post__footer-block">
        <button
          class="post__btn post__like"
          :class="{ 'active-like': isCurrentUserLike(post.likes) }"
          @click="$emit('like', post.id)"
        >
          Нравится
          <span class="post__like-count">{{ post.likes.length }}</span>
        </button>
      </div>
      <div class="post__controls post__footer-block">
        <nuxt-link
          v-if="isValidUser"
          class="post__btn post__edit"
          :to="`/edit/${post.id}`"
        >
          Редактировать
        </nuxt-link>
        <button
          v-if="isValidUser"
          class="post__btn post__delete"
          :disabled="pendingRemove"
          @click="removePost"
        >
          Удалить
        </button>
      </div>
    </footer>
  </li>
</template>

<script>
  import getValidURLImageForAvatarMixin from "@/mixins/getValidURLImageForAvatarMixin";
  import getValidURLImageForImagesPostMixin from "@/mixins/getValidURLImageForImagesPostMixin";
  import vShowFull from "@/components/vShowFull";

  export default {
    name: "PostComponent",
    components: { vShowFull, },
    mixins: [getValidURLImageForAvatarMixin, getValidURLImageForImagesPostMixin],
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
        images: [],
        pendingRemove: false,
        isValidUser: false,
      };
    },
    async fetch() {
      try {
        const userOfPost = await this.$store.dispatch(
          "user/getOne",
          this.post.userId
        );
        const currentUser = await this.$store.dispatch("user/getOne");

        if (this.post.images.length) {
          this.post.images.map((image) => {
            this.getValidURLImageForImagesPost(image)
              .then((res) => this.images.push(res))
              .catch((err) => {
                throw err;
              });
          });
        }

        this.isValidUser = currentUser.user.id === userOfPost.user.id;
        this.user = {
          ...userOfPost.user,
          avatar: await this.getValidURLImageForAvatar(userOfPost.user.avatar),
        };
        this.currentUser = currentUser.user;
      } catch (err) {
        throw err;
      }
    },
    methods: {
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
      removePost() {
        const { id, } = this.post;
        const token = this.$store.getters["auth/getToken"];
        const res = this.$store.dispatch("post/remove", { token, postId: id, });

        this.pending = true;

        res
          .then(({ message, status, }) => {
            this.pending = false;

            if (![400, 500, 404, 403].includes(status)) {
              this.$emit("setAlert", {
                type: "success",
                title: "Успешно",
                desc: message,
                show: true,
              });

              this.$router.go(0);
            } else {
              this.$emit("setAlert", {
                type: "error",
                title: "Ошибка",
                desc: message,
                show: true,
              });
            }
          })
          .catch((err) => {
            this.$emit("setAlert", {
              type: "error",
              title: "Ошибка",
              desc: `Произошла ошибка сервера: ${err}`,
              show: true,
            });

            throw err;
          });
      },
    },
  };
</script>