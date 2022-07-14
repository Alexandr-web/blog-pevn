<template>
  <div class="error-layout">
    <div class="error">
      <div class="container">
        <div class="error__inner">
          <div class="error__center">
            <h1 class="error__title">
              {{ error.statusCode }}
            </h1>
            <h2
              v-if="error.statusCode === 404"
              class="error__subtitle"
            >
              Страница не найдена
            </h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ErrorLayout",
    props: {
      error: {
        type: Object,
        default: () => ({}),
      },
    },
  };
</script>