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
        primary: "#5c6bc0",
        secondary: "#ff9800",
        accent: "#5c6bc0"
      },
      light: {
        primary: "#1976d2",
        secondary: "#ff9800",
        accent: "#1976d2"
      }
    }
  },
  lang: {
    locales: { de },
    current: "de"
  }
});
