import Vue from "vue";
import Vuetify from "vuetify/lib";
import de from "vuetify/es5/locale/de";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi"
  },
  theme: {
    dark: false,
    options: {
      customProperties: true
    },
    themes: {
      dark: {
        primary: "#f07f00",
        secondary: "#3b2e88",
        accent: "#f07f00"
      },
      light: {
        primary: "#3b2e88",
        secondary: "#f07f00",
        accent: "#3b2e88"
      }
    }
  },
  lang: {
    locales: { de },
    current: "de"
  }
});
