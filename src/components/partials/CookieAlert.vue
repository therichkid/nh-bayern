<template>
  <div class="cookie-consent pa-2 pa-md-5" v-if="hasNotAcceptedCookies">
    <v-card outlined class="cookie-consent-card">
      <v-card-text class="pb-0">
        <span>
          Mit der Nutzung dieser Webseite erklären Sie sich damit einverstanden, dass wir Cookies
          verwenden.
        </span>
        <v-btn text to="/datenschutz">Weiterlesen</v-btn>
      </v-card-text>
      <v-card-actions>
        <v-checkbox
          v-model="hasUnderstood"
          label="Ich habe verstanden"
          hide-details
          color="success"
          class="mt-0 pt-0"
        ></v-checkbox>
        <v-spacer></v-spacer>
        <v-btn :disabled="!hasUnderstood" @click="acceptCookies()" color="success"
          >Akzeptieren
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasNotAcceptedCookies: true,
      hasUnderstood: false
    };
  },

  methods: {
    acceptCookies() {
      this.hasNotAcceptedCookies = false;
      localStorage.setItem("cookiesAccepted", true);
    }
  },

  mounted() {
    if (!localStorage.getItem("cookiesAccepted")) {
      localStorage.setItem("cookiesAccepted", false);
    }
    if (localStorage.getItem("cookiesAccepted") === "true") {
      this.hasNotAcceptedCookies = false;
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
</style>
