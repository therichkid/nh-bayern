<template>
  <v-container>
    <h1 class="display-1 mb-2">Selbsthilfegruppen</h1>
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getGroups()" />
    <Map v-if="!loadingError" :groups="groups || []" type="shgs" />
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
      groups: []
    };
  },

  computed: {
    loadingError() {
      return this.$store.state.groupsLoadingError;
    }
  },

  methods: {
    async getGroups() {
      const groupsFetched = this.$store.getters.getFetchedGroups();
      if (groupsFetched[0]) {
        // Already fetched
        this.groups = groupsFetched[1];
      } else {
        // Not fetched yet
        this.groups = await this.$store.dispatch("fetchGroups").catch(error => {
          console.error(error);
        });
      }
    }
  },

  created() {
    this.getGroups();
  }
};
</script>

<style></style>
