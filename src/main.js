import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router/index";
import store from "./store/index";
import VueAnalytics from "vue-analytics";

import shared from "./services/shared";
Vue.prototype.shared = shared;

// reCAPTCHA
import { VueReCaptcha } from "vue-recaptcha-v3";
Vue.use(VueReCaptcha, { siteKey: "6LfQl6UUAAAAACpOBLqwIOQso7e1hGWdDiH_CbwJ" });

// Google Analytics
Vue.use(VueAnalytics, {
  id: "UA-48579646-1",
  router,
  debug: {
    sendHitTask: process.env.NODE_ENV === "production"
  }
});

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
