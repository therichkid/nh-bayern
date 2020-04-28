<template>
  <div class="text-center">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" aria-label="Information" @click="dialog = true">
          <v-icon>mdi-palette</v-icon>
        </v-btn>
      </template>
      <span>Informationen zur Farbgestaltung</span>
    </v-tooltip>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline" style="word-wrap: break-word;">
            Informationen zur Farbgestaltung
          </span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon @click="dialog = false" dark v-on="on" aria-label="Schließen">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Schließen</span>
          </v-tooltip>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="item in items"
              :key="item.color"
              class="px-0"
              style="vertical-align: middle;"
            >
              <v-list-item-avatar :color="item.color" size="24"></v-list-item-avatar>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      items: [
        { color: "var(--v-primary-base)", text: "Neutral" },
        { color: "#512da8", text: "Gebärdensprachorient (DGS)" },
        { color: "#4dd0e1", text: "Lautsprachorientiert (LS)" }
      ]
    };
  }
};
</script>

<style></style>
