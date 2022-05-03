<template>
  <div class="user-page__tab user-delete">
    <h2 class="user-page__tab-title user-delete__title">Вы уверены?</h2>
    <p class="user-page__tab-desc user-delete__desc">
      При удалении аккаунта сотрутся все его данные, включая посты
    </p>
    <button class="user-delete__btn" @click="deleteAccount" :disabled="pending">
      Удалить
    </button>
  </div>
</template>

<script>
export default {
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      pending: false,
    };
  },
  methods: {
    deleteAccount() {
      const token = this.$store.getters["auth/getToken"];
      const res = this.$store.dispatch("user/deleteAccount", token);

      this.pending = true;

      res
        .then(({ status, message }) => {
          if (![400, 500, 404, 403].includes(status)) {
            this.pending = false;

            this.$emit("setAlert", {
              type: "success",
              title: "Успешно",
              desc: message,
              show: true,
            });

            this.$router.push("/");
          } else {
            this.$emit("setAlert", {
              type: "error",
              title: "Ошибка",
              desc: message,
              show: true,
            });
          }
        })
        .catch((err) => {
          this.$emit("setAlert", {
            type: "error",
            title: "Ошибка",
            desc: `Произошла ошибка сервера: ${err}`,
            show: true,
          });
        });
    },
  },
};
</script>