<template>
  <div class="cookie-consent pa-2 pa-md-5" v-if="!hasAcceptedCookies">
    <v-card outlined class="cookie-consent-card">
      <v-card-text class="pb-0">
        <span>
          Diese Webseite verwendet technisch notwendige Cookies, Cookies zu Analysezwecken von
          Google Analytics sowie Cookies für eventuell eingebettete Inhalte von externen Websites.
          Sie können Ihre Einwilligung jederzeit in der Datenkontrolle widerrufen.
        </span>
        <router-link to="/datenschutz">Weiterlesen</router-link>.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <div class="cookie-consent-buttons">
          <v-btn @click="acceptCookies('required')" text class="mr-1"
            >Nur notwendige akzeptieren</v-btn
          >
          <v-btn @click="acceptCookies('all')" color="success">Alle akzeptieren</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasAcceptedCookies: false
    };
  },

  methods: {
    acceptCookies(type) {
      if (type === "all") {
        this.$gtag.optIn();
        localStorage.setItem("cookiesAccepted", "all");
      } else {
        localStorage.setItem("cookiesAccepted", "required");
      }
      this.hasAcceptedCookies = true;
    }
  },

  mounted() {
    const decision = localStorage.getItem("cookiesAccepted");
    if (decision === "all" || decision === "required") {
      this.hasAcceptedCookies = true;
    }
    if (decision === "all") {
      this.$gtag.optIn();
    }
  }
};
</script>

<style scoped>
.cookie-consent {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 5;
}
.cookie-consent-card {
  max-width: 600px;
  pointer-events: auto;
}
.cookie-consent-buttons {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
