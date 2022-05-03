<template>
  <div
    class="alert"
    :class="{
      'alert--error': type === 'error',
      'alert--info': type === 'info',
      'alert--warning': type === 'warning',
      'alert--success': type === 'success',
      'alert--hide': !show,
    }"
  >
    <div class="alert__inner">
      <h3 class="alert__title">{{ title }}</h3>
      <p class="alert__desc">{{ desc }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  mounted() {
    setTimeout(() => this.$emit("hide"), 5000);
  },
};
</script>