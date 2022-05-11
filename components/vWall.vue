<template>
  <div class="wall">
    <ul class="posts" v-if="posts.length">
      <vPost
        v-for="(post, index) in posts"
        :key="index"
        :post="post"
        @like="like"
        @setAlert="callAlert"
      />
    </ul>
    <button class="show-also-btn" @click="showAlso" :disabled="pendingPosts" v-if="showBtn">Показать еще</button>
  </div>
</template>

<script>
import vPost from "@/components/vPost";

export default {
  components: {
    vPost,
  },
  data() {
    return {
      posts: [],
      numberPostsOnScreen: 6,
      activeCount: 0,
      pendingPosts: false,
      showBtn: true
    };
  },
  async fetch() {
    try {
      const fd = {
        count: this.activeCount,
        size: this.numberPostsOnScreen
      }
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
        size: this.numberPostsOnScreen
      }
      const res = this.$store.dispatch("post/getSlicePosts", fd);

      this.pendingPosts = true;

      res.then(({ posts, end }) => {
        this.pendingPosts = false;
        this.showBtn = !end;
        this.activeCount += 1;
        this.posts = this.posts.concat(posts);
      }).catch(err => {
        throw err;
      });
    },
    async like(postId) {
      try {
        const token = this.$store.getters["auth/getToken"];
        const res = await this.$store.dispatch("post/like", {
          fd: { postId },
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
    }
  },
};
</script>