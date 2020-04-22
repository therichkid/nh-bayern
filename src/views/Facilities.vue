<template>
  <v-container>
    <h1 class="display-1 mb-2">Kliniken, Rehas, Beratungsstellen</h1>
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getFacilities()" />
    <Map v-if="!loadingError" :groups="facilities || []" type="facilities" />
  </v-container>
</template>

<script>
import Map from "@/components/maps/Map";
const LoadingError = () =>
  import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    Map,
    LoadingError
  },

  data() {
    return {
      facilities: []
    };
  },

  computed: {
    loadingError() {
      return this.$store.state.facilitiesLoadingError;
    }
  },

  methods: {
    async getFacilities() {
      const facilitiesFetched = this.$store.getters.getFetchedFacilities();
      if (facilitiesFetched[0]) {
        // Already fetched
        this.facilities = facilitiesFetched[1];
      } else {
        // Not fetched yet
        this.facilities = await this.$store
          .dispatch("fetchFacilities")
          .catch(error => console.error(error));
      }
    }
  },

  created() {
    this.getFacilities();
  }
};
</script>

<style></style>
