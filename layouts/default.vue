<template>
  <div class="default-layout">
    <vHeader />
    <Nuxt />
  </div>
</template>

<script>
import vHeader from "@/components/vHeader";
import setThemeMixin from "@/mixins/setThemeMixin";

export default {
  mixins: [setThemeMixin],
  components: {
    vHeader,
  }
};
</script>