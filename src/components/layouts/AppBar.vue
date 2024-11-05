<template>
  <v-app-bar clipped-left app dark color="primary flex" v-bind="responsiveProps">
    <v-app-bar-nav-icon
      @click.stop="onMenuToggleClick()"
      class="hidden-lg-and-up"
      aria-label="Menü"
    ></v-app-bar-nav-icon>

    <router-link to="/">
      <v-img
        v-if="appBarIsExpanded"
        class="ml-2 mt-1 tall-logo"
        src="@/assets/logo_text.png"
        height="112"
        width="230"
        contain
        alt="NH Bayern-Logo"
      ></v-img>
      <v-img
        v-else
        class="ml-2 mt-1"
        src="@/assets/logo.png"
        height="40"
        width="37"
        contain
        alt="NH Bayern-Logo"
      ></v-img>
    </router-link>

    <v-toolbar-title v-if="!appBarIsExpanded" class="ml-2 headline">
      <span v-if="shouldShowLongTitle">Netzwerk Hörbehinderung Bayern</span>
      <span v-else>NH Bayern</span>
    </v-toolbar-title>

    <!-- Has ref and height to measure the title dimensions -->
    <v-spacer ref="spacer" style="height: 100%"></v-spacer>

    <SearchBar />

    <v-menu left bottom :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" aria-label="Einstellungen">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <!-- Font size -->
        <v-subheader>Schriftgröße: {{ fontSize }}px</v-subheader>
        <v-list-item
          v-for="(item, i) in fontSizeMenu"
          :key="i"
          @click="onFontSizeChange(item.action)"
          :disabled="
            (i === 0 && fontSize >= 30) ||
            (i === 1 && fontSize <= 10) ||
            (i === 2 && fontSize === 16)
          "
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <!-- Dark mode -->
        <v-list-item @click="toggleDarkMode()">
          <v-list-item-icon>
            <v-icon :color="toggle.color">{{ toggle.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Thema</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import SearchBar from "@/components/partials/SearchBar";

export default {
  components: {
    SearchBar
  },

  data() {
    return {
      fontSizeMenu: [
        {
          name: "Vergrößern",
          icon: "mdi-magnify-plus",
          action: +1
        },
        {
          name: "Verkleinern",
          icon: "mdi-magnify-minus",
          action: -1
        },
        {
          name: "Zurücksetzen",
          icon: "mdi-undo",
          action: null
        }
      ],
      appBarIsExpanded: true,
      shouldShowLongTitle: true
    };
  },

  computed: {
    fontSize() {
      return this.$store.state.fontSize;
    },
    toggle() {
      let icon, color;
      if (this.$vuetify.theme.dark) {
        icon = "mdi-weather-night";
        color = "#03a9f4";
      } else {
        icon = "mdi-weather-sunny";
        color = "#ffc107";
      }
      return { icon, color };
    },
    responsiveProps() {
      if (this.$vuetify.breakpoint.xsOnly) {
        return {};
      } else {
        return {
          prominent: true,
          shrinkOnScroll: true
        };
      }
    }
  },

  methods: {
    onMenuToggleClick() {
      this.$emit("toggleClicked");
    },
    onFontSizeChange(fontSize) {
      this.$store.commit("changeFontSize", fontSize);
    },
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.toggleDarkModeSetting();
    },
    toggleDarkModeSetting() {
      if (localStorage.getItem("darkMode") === "true") {
        localStorage.setItem("darkMode", false);
      } else {
        localStorage.setItem("darkMode", true);
      }
    },
    checkTitleDimensions() {
      if (!this.$refs.spacer) {
        return;
      }
      this.appBarIsExpanded = this.$refs.spacer.clientHeight > 100;
      this.shouldShowLongTitle = window.innerWidth > 750;
    }
  },

  mounted() {
    if (
      (window.matchMedia("(prefers-color-scheme: dark)").matches &&
        localStorage.getItem("darkMode") !== "false") ||
      localStorage.getItem("darkMode") === "true"
    ) {
      this.$vuetify.theme.dark = true;
    } else {
      this.$vuetify.theme.dark = false;
    }
    this.checkTitleDimensions();
    setInterval(this.checkTitleDimensions, 250);
    window.addEventListener("scroll", this.checkTitleDimensions);
  },

  unmounted() {
    clearInterval(this.checkTitleDimensions);
    window.removeEventListener("scroll", this.checkTitleDimensions);
  }
};
</script>

<style scoped>
.tall-logo {
  display: inline-block;
}
.tall-title {
  display: inline-block;
  vertical-align: top;
  padding-top: 9px;
  margin-left: -84px;
  line-height: 26px !important;
}
</style>
