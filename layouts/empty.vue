<template>
  <Nuxt />
</template>

<script>
  import setThemeMixin from "@/mixins/setThemeMixin";

  export default {
    name: "EmptyLayout",
    mixins: [setThemeMixin],
  };
</script>