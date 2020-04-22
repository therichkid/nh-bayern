<template>
  <div>
    <!-- Pages without maps -->
    <v-fab-transition v-if="!isRouteWithMap">
      <v-btn
        fab
        large
        dark
        color="secondary"
        fixed
        right
        bottom
        @click="scrollToTop()"
        v-show="fabVisible"
        aria-label="Nach oben scrollen"
      >
        <v-icon dark>mdi-chevron-up</v-icon>
      </v-btn>
    </v-fab-transition>
    <!-- Pages with maps -->
    <div class="fab-container" v-if="isRouteWithMap">
      <v-btn
        fab
        large
        dark
        color="secondary"
        class="mb-2"
        @click="scrollToTop()"
        aria-label="Nach oben scrollen"
      >
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
      <v-btn
        fab
        large
        dark
        color="secondary"
        class="mt-2"
        @click="scrollDown()"
        aria-label="Nach unten scrollen"
      >
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fabVisible: false,
      isIE: /MSIE|Trident|EdgeHTML/.test(window.navigator.userAgent)
    };
  },

  computed: {
    isRouteWithMap() {
      return ["shgs", "facilities"].includes(this.$route.name);
    }
  },

  methods: {
    scrollHandler() {
      if (window.scrollY > 250) {
        this.fabVisible = true;
      } else {
        this.fabVisible = false;
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    },
    scrollDown() {
      if (this.isIE) {
        window.scrollBy(0, 150);
      } else {
        window.scrollBy({
          top: 150,
          left: 0,
          behavior: "smooth"
        });
      }
    }
  },

  created() {
    window.addEventListener("scroll", this.scrollHandler);
  },

  destroyed() {
    window.removeEventListener("scroll", this.scrollHandler);
  }
};
</script>

<style>
.fab-container {
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 4;
  bottom: 16px;
  right: 16px;
}
</style>
