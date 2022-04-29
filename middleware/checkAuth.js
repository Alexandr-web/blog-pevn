import jwtDecode from "jwt-decode";

export default ({ store, redirect }) => {
  store.dispatch("auth/autoLogin");

  if (!store.getters["auth/getToken"]) {
    return redirect("/auth/login");
  }

  const data = jwtDecode(store.getters["auth/getToken"]);

  if (!data) {
    store.commit("auth/clearToken");

    return redirect("/auth/login");
  }
}