<template>
  <div class="preloader" v-if="loading"></div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    }
  }
}
</script>