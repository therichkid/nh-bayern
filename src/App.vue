<template>
  <v-app>
    <NavigationDrawer ref="drawer" />

    <AppBar @toggleClicked="onToggleEmit()" />

    <v-content>
      <v-container fluid class="main-container">
        <router-view />
      </v-container>
      <Footer />
    </v-content>

    <FAB />

    <CookieAlert />
  </v-app>
</template>

<script>
import NavigationDrawer from "@/components/layouts/NavigationDrawer";
import AppBar from "@/components/layouts/AppBar";
import Footer from "@/components/layouts/Footer";
import FAB from "@/components/partials/FAB";
import CookieAlert from "@/components/partials/CookieAlert";

export default {
  components: { NavigationDrawer, AppBar, Footer, FAB, CookieAlert },

  methods: {
    onToggleEmit() {
      this.$refs.drawer.drawer = !this.$refs.drawer.drawer;
    }
  },

  mounted() {
    // Workaround to disable ripple effect on touchmove
    window.addEventListener(
      "touchmove",
      () => {
        document.body.classList.add("hide-ripple");
      },
      { passive: true }
    );
    window.addEventListener("touchend", () => {
      setTimeout(() => {
        document.body.classList.remove("hide-ripple");
      }, 50);
    });
  }
};
</script>

<style>
.main-container {
  max-width: 1200px;
  min-height: 60vh;
}
.grecaptcha-badge {
  display: none;
}
.post-container {
  max-width: 750px;
  line-height: 1.8;
  word-wrap: break-word;
  hyphens: auto;
  text-align: justify;
}
.event-card {
  width: 100%;
  min-width: 200px;
  max-width: 275px;
}
.v-card__title {
  word-break: normal;
}
.v-banner__wrapper {
  border-bottom: none !important;
}
.hide-ripple .v-ripple__container {
  display: none;
}
/* WP classes */
/* Inherited via v-html so they need a global style to be attached */
[class*="wp-image"],
.wp-caption {
  height: auto;
  max-width: 100%;
}
.alignleft {
  float: left;
  margin: 0 10px 0 0;
  max-width: 100%;
}
.aligncenter {
  display: block;
  margin: 0 auto;
  max-width: 100%;
}
.alignright {
  float: right;
  margin: 0 0 0 10px;
  max-width: 100%;
}
.alignnone {
  margin: 0;
  max-width: 100%;
}
.tablepress {
  width: 100%;
  display: table;
  overflow-x: auto;
  overflow-y: hidden;
}
iframe {
  max-width: 100%;
}
</style>
