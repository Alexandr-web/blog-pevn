<template>
  <div class="page">
    <div class="container">
      <ul class="alerts">
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
      </ul>
      <div class="user-page">
        <vUserHeader :user="user" :isCurrentUser="isCurrentUser" />
        <main class="user-page__main" v-if="isCurrentUser">
          <vUserInfo v-if="$route.query.tab === 'info'" :user="user" />
          <vUserSettings
            v-if="$route.query.tab === 'settings' && isCurrentUser"
            @setAlert="setAlert"
          />
          <vUserDelete
            v-if="$route.query.tab === 'delete' && isCurrentUser"
            @setAlert="setAlert"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import vUserInfo from "@/components/vUserInfo";
import vUserSettings from "@/components/vUserSettings";
import vUserDelete from "@/components/vUserDelete";
import vAlert from "@/components/vAlert";
import vUserHeader from "@/components/vUserHeader";

export default {
  watchQuery: ["tab"],
  middleware: "checkAuth",
  layout: "default",
  data() {
    return {
      alertData: {
        show: false,
        type: "",
        title: "",
        desc: "",
      },
    };
  },
  mixins: [getValidURLImageForAvatarMixin],
  async asyncData({ store, query: { tab, }, params: { id, }, }) {
    try {
      const { ok: completeUserById, user: userById } = await store.dispatch("auth/getUser", id);
      const { ok: completeCurrentUser, user: currentUser, } = await store.dispatch("auth/getUser");

      return {
        user: completeUserById ? userById : {},
        isCurrentUser: completeCurrentUser ? currentUser.id === userById.id : false,
        tab,
      }
    } catch (err) {
      throw err;
    }
  },
  validate({ params, store }) {
    const { id } = params;

    if (!/^\d+$/g.test(id)) {
      return false;
    }

    const getCandidate = store.dispatch("auth/getUser", id);

    return getCandidate
      .then(({ user }) => Boolean(Object.keys(user).length))
      .catch((err) => {
        throw err;
      });
  },
  mounted() {
    if (!this.$route.query.tab) {
      this.$router.push("?tab=info");
    }
  },
  methods: {
    setAlert(options) {
      this.alertData = options;
    },
    hideAlert() {
      this.alertData.show = false;
    },
  },
  components: {
    vUserInfo,
    vUserSettings,
    vUserDelete,
    vAlert,
    vUserHeader,
  },
};
</script>