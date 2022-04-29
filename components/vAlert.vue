<template>
  <div
    class="alert"
    :class="{
      'alert--error': type === 'error',
      'alert--info': type === 'info',
      'alert--warning': type === 'warning',
      'alert--success': type === 'success',
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
  },
  created() {
    setTimeout(() => {
      this.$destroy();

      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
    }, 5000);
  },
};
</script>