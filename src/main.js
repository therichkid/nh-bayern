import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router/index";
import store from "./store/index";
import VueAnalytics from "vue-analytics";

import shared from "./services/shared";
Vue.prototype.shared = shared;

// Google Analytics
Vue.use(VueAnalytics, {
  id: "UA-48579646-1",
  router,
  debug: {
    sendHitTask: process.env.NODE_ENV === "production"
  },
  disabled: true
});

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
