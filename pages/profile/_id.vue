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
        <header class="user-page__header">
          <div class="user-page__info">
            <div class="user-page__info-avatar">
              <img
                class="user-page__info-avatar-image"
                :src="user.avatar"
                alt=""
              />
            </div>
            <div class="user-page__info-person">
              <h2 class="user-page__info-name">{{ user.name }}</h2>
              <h3 class="user-page__info-email">{{ user.email }}</h3>
            </div>
          </div>
          <nav class="user-page__navbar" v-if="isCurrentUser">
            <ul class="user-page__navbar-list">
              <li class="user-page__navbar-list-item">
                <nuxt-link
                  class="user-page__navbar-list-link"
                  :to="`/profile/${user.id}?tab=info`"
                  exact-active-class="active-user-link"
                >
                  Личная информация
                </nuxt-link>
              </li>
              <li class="user-page__navbar-list-item" v-if="isCurrentUser">
                <nuxt-link
                  class="user-page__navbar-list-link"
                  :to="`/profile/${user.id}?tab=settings`"
                  exact-active-class="active-user-link"
                >
                  Настройки
                </nuxt-link>
              </li>
              <li class="user-page__navbar-list-item" v-if="isCurrentUser">
                <nuxt-link
                  class="user-page__navbar-list-link"
                  :to="`/profile/${user.id}?tab=delete`"
                  exact-active-class="active-user-link"
                >
                  Удаление аккаунта
                </nuxt-link>
              </li>
            </ul>
          </nav>
        </header>
        <main class="user-page__main" v-if="isCurrentUser">
          <vUserInfo v-if="tab === 'info'" :user="user" />
          <vUserSettings
            v-if="tab === 'settings' && isCurrentUser"
            @setAlert="setAlert"
          />
          <vUserDelete
            v-if="tab === 'delete' && isCurrentUser"
            @setAlert="setAlert"
            :userId="user.id"
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
import getValidURLImageForAvatar from "@/getValidURLImageForAvatar/index";

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
  async asyncData({ params: { id }, query: { tab }, store }) {
    try {
      const candidate = await store.dispatch("auth/getUser", id);
      const currentUser = await store.dispatch("auth/getUser");

      return {
        tab,
        user: candidate.ok
          ? {
              ...candidate.user,
              avatar: await getValidURLImageForAvatar(candidate.user.avatar),
            }
          : {},
        isCurrentUser: candidate.ok
          ? currentUser.user.id === candidate.user.id
          : false,
      };
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
  },
};
</script>