<template>
  <v-bottom-sheet v-model="hasNotAcceptedCookies" persistent hide-overlay>
    <v-sheet
      :color="$vuetify.theme.dark ? '#666666' : '#e4e4e4'"
      class="text-center"
      style="border-bottom-left-radius: 0; border-bottom-right-radius: 0;"
    >
      <v-container>
        <v-row dense justify="center">
          <v-col cols="12">
            <span>
              Mit der Nutzung dieser Webseite erklären Sie sich damit einverstanden, dass wir
              Cookies verwenden.
            </span>
            <v-btn text to="/datenschutz">Weiterlesen</v-btn>
          </v-col>
          <v-col cols="auto" class="mr-1">
            <v-checkbox
              v-model="hasUnderstood"
              label="Ich habe verstanden"
              hide-details
              class="my-0"
            ></v-checkbox>
          </v-col>
          <v-col cols="auto" class="ml-1">
            <v-btn :disabled="!hasUnderstood" @click="acceptCookies()" color="success"
              >Akzeptieren
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-bottom-sheet>
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

<style></style>
