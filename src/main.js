import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import VueGtag from "vue-gtag";
import vuetify from "./plugins/vuetify";
import router from "./router/index";
import store from "./store/index";
import shared from "./services/shared";

Vue.prototype.shared = shared;

// Google Analytics
Vue.use(
  VueGtag,
  {
    config: { id: "G-SFXVXEPC2L" },
    enabled: false
  },
  router
);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
