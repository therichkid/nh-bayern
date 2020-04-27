<template>
  <div>
    <v-fab-transition>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      fabVisible: false
    };
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

<style></style>
