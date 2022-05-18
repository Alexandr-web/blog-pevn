<template>
  <div class="default-layout">
    <vHamburger :active="showMenu" @switchActive="switchActive" />
    <vHeader :show="showMenu" />
    <Nuxt />
  </div>
</template>

<script>
import vHeader from "@/components/vHeader";
import setThemeMixin from "@/mixins/setThemeMixin";
import vHamburger from "@/components/vHamburger";

export default {
  mixins: [setThemeMixin],
  data() {
    return {
      showMenu: false
    }
  },
  methods: {
    switchActive(val) {
      this.showMenu = val;
    }
  },
  components: {
    vHeader,
    vHamburger
  }
};
</script>