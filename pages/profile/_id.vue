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
        <vUserHeader
          :user="user"
          :is-current-user="isCurrentUser"
        />
        <main
          v-if="isCurrentUser"
          class="user-page__main"
        >
          <vUserInfo
            v-if="$route.query.tab === 'info'"
            :user="user"
          />
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
    name: "ProfilePage",
    components: {
      vUserInfo,
      vUserSettings,
      vUserDelete,
      vAlert,
      vUserHeader,
    },
    layout: "default",
    middleware: "checkAuth",
    validate({ params, store, }) {
      const { id, } = params;

      if (!/^\d+$/g.test(id)) {
        return false;
      }

      const getCandidate = store.dispatch("user/getOne", id);

      return getCandidate
        .then(({ user, }) => Boolean(Object.keys(user).length))
        .catch((err) => {
          throw err;
        });
    },
    async asyncData({ store, query: { tab, }, params: { id, }, }) {
      try {
        const { ok: completeUserById, user: userById, } = await store.dispatch("user/getOne", id);
        const { ok: completeCurrentUser, user: currentUser, } = await store.dispatch("user/getOne");

        return {
          user: completeUserById ? userById : {},
          isCurrentUser: completeCurrentUser ? currentUser.id === userById.id : false,
          tab,
        };
      } catch (err) {
        throw err;
      }
    },
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
    watchQuery: ["tab"],
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
  };
</script>