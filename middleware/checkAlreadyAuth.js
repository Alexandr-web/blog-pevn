export default ({ store, redirect }) => {
  store.dispatch("auth/autoLogin");

  if (store.getters["auth/getToken"]) {
    return redirect("/");
  }
}