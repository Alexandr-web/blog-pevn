<template>
  <div class="page">
    <div class="container">
      <h1 class="title">Главная</h1>
      <vWall />
    </div>
  </div>
</template>

<script>
import vWall from "@/components/vWall";

export default {
  layout: "default",
  middleware: "checkAuth",
  components: {
    vWall,
  },
};
</script>
