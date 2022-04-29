<template>
  <div class="wall">
    <ul class="posts" v-if="posts.length">
      <vPost v-for="(post, index) in posts" :key="index" :post="post" />
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
};
</script>