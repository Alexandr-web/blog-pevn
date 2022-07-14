<template>
  <div class="wall">
    <ul
      v-if="posts.length"
      class="posts wall__block"
    >
      <vPost
        v-for="(post, index) in posts"
        :key="index"
        :post="post"
        @like="like"
        @setAlert="callAlert"
      />
    </ul>
    <div
      v-if="showBtn"
      class="wall__block"
    >
      <button
        class="show-also-btn"
        :disabled="pendingPosts"
        @click="showAlso"
      >
        Показать еще
      </button>
    </div>
  </div>
</template>

<script>
  import vPost from "@/components/vPost";

  export default {
    name: "WallComponent",
    components: { vPost, },
    data() {
      return {
        posts: [],
        numberPostsOnScreen: 6,
        activeCount: 0,
        pendingPosts: false,
        showBtn: false,
      };
    },
    async fetch() {
      try {
        const fd = {
          count: this.activeCount,
          size: this.numberPostsOnScreen,
        };
        const res = await this.$store.dispatch("post/getSlicePosts", fd);

        this.showBtn = !res.end;
        this.posts = res.posts;
        this.activeCount += 1;
      } catch (err) {
        throw err;
      }
    },
    methods: {
      showAlso() {
        const fd = {
          count: this.activeCount,
          size: this.numberPostsOnScreen,
        };
        const res = this.$store.dispatch("post/getSlicePosts", fd);

        this.pendingPosts = true;

        res
          .then(({ posts, end, }) => {
            this.pendingPosts = false;
            this.showBtn = !end;
            this.activeCount += 1;
            this.posts = this.posts.concat(posts);
          })
          .catch((err) => {
            throw err;
          });
      },

      async like(postId) {
        try {
          const token = this.$store.getters["auth/getToken"];
          const res = await this.$store.dispatch("post/like", {
            fd: { postId, },
            token,
          });

          this.posts = this.posts.map((post) => {
            if (post.id === postId) {
              post.likes = res.likes;
            }

            return post;
          });
        } catch (err) {
          throw err;
        }
      },

      callAlert(options) {
        this.$emit("callAlert", options);
      },
    },
  };
</script>