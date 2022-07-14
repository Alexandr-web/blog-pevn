<template>
  <div
    class="show-full"
    :class="{ 'show-full--open': showFull && showArea }"
  >
    <slot name="target"></slot>
    <div
      v-if="showArea && !showFull"
      class="show-full__area"
    >
      <button
        class="show-full__btn"
        @click="showFull = !showFull"
      >
        Показать полностью
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ShowFullComponent",
    data() {
      return {
        showFull: false,
        showArea: false,
      };
    },
    async mounted() {
      const targets = await this.$slots.target;

      if (targets && targets.length) {
        this.showArea = targets[0] ? targets[0].elm.offsetHeight >= 100 : false;
      }
    },
  };
</script>