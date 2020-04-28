<template>
  <v-card>
    <!-- Header -->
    <v-card-title
      class="white--text"
      :style="{
        'background-color': `${event.color || 'var(--v-primary-base)'}`
      }"
    >
      <span class="headline pr-2">{{ event.dayFormatted }}.</span>
      <span class="caption pt-2 text-truncate" style="flex: 10 0;">{{ event.monthFormatted }}</span>
      <template v-if="type === 'popup'">
        <v-spacer></v-spacer>
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

    <v-card-title>
      <h3 class="headline">{{ event.title }}</h3>
    </v-card-title>

    <!-- Body -->
    <v-card-text>
      <v-chip
        v-if="event.registration"
        :color="event.color || 'primary'"
        text-color="white"
        class="mb-2"
      >
        Bitte anmelden!
      </v-chip>
      <v-row align="center" dense>
        <!-- Groups -->
        <v-col cols="12" v-if="event.groups.length">
          <v-icon :color="event.color || 'primary'" class="pr-1">mdi-account-multiple</v-icon>
          <span v-for="(group, i) in event.groups" :key="i">
            <span v-if="i !== 0">, </span>
            <router-link :to="'/netzwerk/' + group.slug">{{ group.name }}</router-link>
          </span>
        </v-col>
        <!-- Address -->
        <v-col cols="12">
          <v-icon :color="event.color || 'primary'" class="pr-1">mdi-map-marker</v-icon>
          <span class="mr-2">{{ event.address }}</span>
        </v-col>
        <!-- Time -->
        <v-col cols="12">
          <v-icon :color="event.color || 'primary'" class="pr-1">mdi-clock</v-icon>
          <span class="mr-2">
            {{ event.startTime }}
            <span v-if="event.endTime">bis {{ event.endTime }}</span>
          </span>
        </v-col>
      </v-row>
      <!-- Content -->
      <div
        v-html="event.content"
        :style="{ fontSize: fontSize + 'px' }"
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
      <v-btn right :to="`${link}/anmeldung`" v-if="event.registration">
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
