<template>
  <v-dialog v-model="dialog" max-width="750" persistent>
    <v-card>
      <v-card-title class="white--text" :class="alertType">
        <span class="headline">{{ alertType === "success" ? "Erfolg" : "Fehler" }}</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon @click="onCloseButtonClick()" dark v-on="on" aria-label="Schließen">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Schließen</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text class="mt-2">{{ alertMessage }}</v-card-text>
      <v-card-actions>
        <v-btn v-if="alertType === 'success' && page === 'form'" to="/">
          <v-icon>mdi-chevron-left</v-icon>
          <span>Home</span>
        </v-btn>
        <v-btn v-else @click="closeDialog">
          <v-icon>mdi-chevron-left</v-icon>
          <span>Zurück</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    alertType: String,
    alertMessage: String,
    page: String
  },

  methods: {
    closeDialog() {
      this.$emit("dialog");
    },
    onCloseButtonClick() {
      if (this.alertType === "success" && this.page === "form") {
        this.$router.push("/");
      } else {
        this.closeDialog();
      }
    }
  }
};
</script>

<style></style>
