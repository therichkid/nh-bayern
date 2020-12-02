<template>
  <v-dialog v-model="isSelectedOpen" scrollable max-width="600px">
    <template v-slot:activator="{ on }">
      <v-card hover v-on="on" class="d-flex flex-column event-card" style="min-width: 220px">
        <!-- Header -->
        <v-card-title class="primary white--text">
          <span class="headline pr-2">{{ event.dayFormatted }}.</span>
          <span class="caption pt-2 text-truncate" style="flex: 10 0">
            {{ event.monthFormatted }}
          </span>
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
                  small
                >
                  {{ group.name }}
                </v-chip>
              </v-chip-group>
            </v-col>
            <v-col cols="12">
              <h3 :class="$vuetify.breakpoint.mdAndUp ? 'headline' : 'title'">{{ event.title }}</h3>
            </v-col>
          </v-row>
        </v-card-title>

        <!-- Body -->
        <v-card-text>
          <v-chip v-if="event.registration" color="primary" text-color="white" small class="mb-2">
            Bitte anmelden!
          </v-chip>
          <v-row align="center" dense>
            <!-- Address -->
            <v-col cols="12">
              <v-icon color="primary" class="pr-1">mdi-map-marker</v-icon>
              <span class="mr-2">{{ event.address }}</span>
            </v-col>
            <!-- Time -->
            <v-col cols="12">
              <v-icon color="primary" class="pr-1">mdi-clock</v-icon>
              <span class="mr-2">
                {{ event.startTime }}
                <span v-if="event.endTime">bis {{ event.endTime }}</span>
              </span>
            </v-col>
          </v-row>
        </v-card-text>
        <v-spacer></v-spacer>
        <!-- Actions -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-icon>mdi-chevron-right</v-icon>
        </v-card-actions>
      </v-card>
    </template>

    <!-- Event popup -->
    <EventModal :event="event" type="popup" @onClose="isSelectedOpen = false" />
  </v-dialog>
</template>

<script>
const EventModal = () => import(/* webpackChunkName: "dialog" */ "@/components/events/EventModal");

export default {
  components: {
    EventModal
  },

  props: {
    event: Object
  },

  data() {
    return {
      isSelectedOpen: false
    };
  }
};
</script>

<style></style>
