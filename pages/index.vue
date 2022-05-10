<template>
  <div class="page">
    <div class="container">
      <div class="alerts">
        <vAlert
          v-if="
            Object.values(alertData)
              .filter((val) => val !== 'show')
              .every(Boolean)
          "
          :title="alertData.title"
          :desc="alertData.desc"
          :type="alertData.type"
          :show="alertData.show"
          @hide="hideAlert"
        />
      </div>
      <h1 class="title">Главная</h1>
      <vWall @callAlert="callAlert" />
    </div>
  </div>
</template>

<script>
import vWall from "@/components/vWall";
import vAlert from "@/components/vAlert";

export default {
  layout: "default",
  middleware: "checkAuth",
  data() {
    return {
      alertData: {
        type: "",
        title: "",
        desc: "",
        show: false,
      },
    };
  },
  components: {
    vWall,
    vAlert,
  },
  methods: {
    callAlert(options) {
      this.alertData = options;
    },
    hideAlert() {
      this.alertData.show = false;
    }
  },
};
</script>
