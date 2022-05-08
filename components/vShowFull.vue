<template>
  <div class="show-full" :class="{ 'show-full--open': showFull && showArea }">
    <slot name="target"></slot>
    <div class="show-full__area" v-if="showArea && !showFull">
      <button class="show-full__btn" @click="showFull = !showFull">Показать полностью</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showFull: false,
      showArea: false
    }
  },
  async mounted() {
    const el = await this.$slots.target[0];
    
    this.showArea = el ? el.elm.offsetHeight >= 100 : false;
  }
}
</script>