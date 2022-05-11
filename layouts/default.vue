<template>
  <div class="default-layout">
    <vHeader />
    <Nuxt />
  </div>
</template>

<script>
import vHeader from "@/components/vHeader";

export default {
  components: {
    vHeader,
  },
  mounted() {
    const theme = localStorage.getItem("theme");

    if (theme) {
      document.body.dataset.theme = theme;
    } else {
      localStorage.setItem("theme", "dark");

      document.body.dataset.theme = "dark";
    }
  }
};
</script>