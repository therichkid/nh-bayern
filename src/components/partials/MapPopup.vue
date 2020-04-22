<template>
  <l-popup>
    <h3 class="headline mb-2">{{ group.name }}</h3>
    <!-- Address -->
    <div class="align-center mb-2">
      <v-icon color="primary" class="icon">mdi-map-marker</v-icon>
      <span style="color: rgba(0, 0, 0, 0.6);" class="body-2 text">{{ group.address }}</span>
    </div>
    <!-- Telephone -->
    <div class="align-center mb-2" v-if="group.phone">
      <v-icon color="primary" class="icon">mdi-phone</v-icon>
      <span style="color: rgba(0, 0, 0, 0.6);" class="body-2 text">
        <a :href="`tel:${group.phone}`">{{ group.phone }}</a>
      </span>
    </div>
    <!-- Fax -->
    <div class="align-center mb-2" v-if="group.fax">
      <v-icon color="primary" class="icon">mdi-fax</v-icon>
      <span style="color: rgba(0, 0, 0, 0.6);" class="body-2 text">
        <a :href="`tel:${group.fax}`">{{ group.fax }}</a>
      </span>
    </div>
    <!-- E-Mail -->
    <div class="align-center mb-2" v-if="group.email">
      <v-icon color="primary" class="icon">mdi-email</v-icon>
      <span style="color: rgba(0, 0, 0, 0.6);" class="body-2 text">{{ group.email }}</span>
    </div>
    <!-- Link -->
    <div class="d-flex" v-if="type === 'shgs' || (type === 'facilities' && group.homepage)">
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            right
            light
            :to="`/shgs/${group.slug}`"
            v-on="on"
            v-if="type === 'shgs'"
            aria-label="Öffnen"
          >
            <v-icon>mdi-open-in-app</v-icon>
          </v-btn>
          <v-btn
            icon
            right
            light
            :href="group.homepage"
            target="_blank"
            rel="noopener noreferrer"
            v-on="on"
            v-if="type === 'facilities' && group.homepage"
            aria-label="Öffnen"
          >
            <v-icon>mdi-open-in-app</v-icon>
          </v-btn>
        </template>
        <span>Seite öffnen</span>
      </v-tooltip>
    </div>
  </l-popup>
</template>

<script>
import { LPopup } from "vue2-leaflet";

export default {
  components: {
    LPopup
  },

  props: {
    group: Object,
    type: String
  }
};
</script>

<style scoped>
.icon {
  float: left;
}
.text {
  display: block;
  padding-left: 40px;
}
</style>
