<template>
  <div class="wall">
    <ul class="posts" v-if="posts.length">
      <vPost
        v-for="(post, index) in posts"
        :key="index"
        :post="post"
        @like="like"
      />
    </ul>
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
    };
  },
  async fetch() {
    try {
      const res = await this.$store.dispatch("post/asyncPosts");

      this.posts = res.ok ? res.posts.reverse() : [];
    } catch (err) {
      throw err;
    }
  },
  methods: {
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
  },
};
</script>