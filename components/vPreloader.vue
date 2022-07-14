<template>
  <div
    v-if="loading"
    class="preloader"
  ></div>
</template>

<script>
  export default {
    name: "PreloaderComponent",
    props: {
      loading: {
        type: Boolean,
        required: true,
      },
    },
  };
</script>