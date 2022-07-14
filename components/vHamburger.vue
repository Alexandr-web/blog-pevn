<template>
  <button
    class="hamburger"
    :class="{ 'hamburger--active': active }"
    @click="$emit('switchActive', !active)"
  >
    <span class="hamburger__line hamburger__line-top"></span>
    <span class="hamburger__line hamburger__line-middle"></span>
    <span class="hamburger__line hamburger__line-bottom"></span>
  </button>
</template>

<script>
  export default {
    name: "HamburgerComponent",
    props: {
      active: {
        type: Boolean,
        required: true,
      },
    },
  };
</script>