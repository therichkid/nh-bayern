<template>
  <v-card>
    <!-- Header -->
    <v-card-title class="primary white--text">
      <span class="headline pr-2">{{ event.dayFormatted }}.</span>
      <span class="caption pt-2 text-truncate" style="flex: 10 0">{{ event.monthFormatted }}</span>
      <v-spacer></v-spacer>
      <template v-if="event.registration">
        <v-btn text dark :to="`${link}/anmeldung`" v-if="$vuetify.breakpoint.mdAndUp">
          <v-icon class="mr-2">mdi-account-plus</v-icon>
          <span>Anmelden</span>
        </v-btn>
        <v-btn
          icon
          dark
          :to="`${link}/anmeldung`"
          v-if="$vuetify.breakpoint.smAndDown"
          aria-label="Zur Anmeldung"
        >
          <v-icon class="mr-2">mdi-account-plus</v-icon>
        </v-btn>
      </template>
      <template v-if="type === 'popup'">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon dark v-on="on" :to="link" aria-label="Maximieren">
              <v-icon>mdi-window-maximize</v-icon>
            </v-btn>
          </template>
          <span>Maximieren</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon @click="closeModal()" dark v-on="on" aria-label="Schließen">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Schließen</span>
        </v-tooltip>
      </template>
    </v-card-title>

    <v-card-title class="pt-0">
      <v-row no-gutters>
        <v-col cols="12">
          <!-- Groups -->
          <v-chip-group column>
            <v-chip
              :color="event.color || 'primary'"
              text-color="white"
              v-for="group in event.groups"
              :key="group.name"
              :to="group.type === 'group' ? '/netzwerk/' + group.slug : ''"
              small
            >
              {{ group.name }}
            </v-chip>
          </v-chip-group>
        </v-col>
        <v-col cols="12">
          <h3 class="headline">{{ event.title }}</h3>
        </v-col>
      </v-row>
    </v-card-title>

    <!-- Body -->
    <v-card-text>
      <v-chip v-if="event.registration" color="primary" text-color="white" class="mb-2">
        Bitte anmelden!
      </v-chip>
      <v-row align="center" dense>
        <!-- Address -->
        <v-col cols="12" v-if="event.address">
          <v-icon color="primary" class="pr-1">mdi-map-marker</v-icon>
          <span>{{ event.address }}</span>
        </v-col>
        <!-- Time -->
        <v-col cols="12">
          <v-icon color="primary" class="pr-1">mdi-clock</v-icon>
          <span>{{ event.startTime }}</span>
          <span v-if="event.endTime"> bis {{ event.endTime }}</span>
        </v-col>
      </v-row>
      <!-- Content -->
      <div
        v-html="event.content"
        :style="{ fontSize: fontSize + 'px', 'text-align': 'justify' }"
        class="mt-2 post-container"
      ></div>
      <!-- Social media -->
      <SocialMedia :link="link" :title="event.title" :type="type" />
    </v-card-text>

    <!-- Actions -->
    <v-card-actions v-if="event.registration || type === 'page'">
      <v-btn @click="goBack()" v-if="type === 'page'">
        <v-icon>mdi-chevron-left</v-icon>
        <span>Zurück</span>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :to="`${link}/anmeldung`" v-if="event.registration">
        <span>Zur Anmeldung</span>
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import SocialMedia from "@/components/partials/SocialMedia";
export default {
  components: {
    SocialMedia
  },

  props: {
    event: Object,
    type: String
  },

  methods: {
    closeModal() {
      this.$emit("onClose");
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  computed: {
    link() {
      return `/events/${this.event.startDate}/${this.event.slug}`;
    },
    fontSize() {
      return this.$store.state.fontSize;
    }
  }
};
</script>

<style></style>
