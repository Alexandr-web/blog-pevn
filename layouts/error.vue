<template>
  <div class="error-layout">
    <div class="error">
      <div class="container">
        <div class="error__inner">
          <div class="error__center">
            <h1 class="error__title">{{ error.statusCode }}</h1>
            <h2 class="error__subtitle" v-if="error.statusCode === 404">
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
  props: ["error"],
};
</script>