<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="display-1 mb-2">Arbeitskreise</h1>
      </v-col>
    </v-row>

    <!-- Working groups -->
    <LoadingSkeleton type="network" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getGroups()" />

    <v-row v-if="!isLoading && !loadingError && groups.length" :dense="$vuetify.breakpoint.xsOnly">
      <v-col cols="6" sm="4" lg="3" v-for="group in groups" :key="group.id" class="d-flex">
        <GroupCard :group="group" />
      </v-col>
    </v-row>

    <v-row>
      <!-- Social media -->
      <v-col cols="12">
        <SocialMedia link="/arbeitskreise" title="Arbeitskreise" />
      </v-col>

      <!-- Actions -->
      <v-col cols="12">
        <v-btn @click="goBack()">
          <v-icon>mdi-chevron-left</v-icon>
          <span>Zurück</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
import GroupCard from "@/components/partials/GroupCard";
import SocialMedia from "@/components/partials/SocialMedia";
const LoadingError = () =>
  import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    LoadingSkeleton,
    LoadingError,
    GroupCard,
    SocialMedia
  },

  data() {
    return {
      groups: []
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.groupsLoading;
    },
    loadingError() {
      return this.$store.state.groupsLoadingError;
    },
    fontSize() {
      return this.$store.state.fontSize;
    }
  },

  methods: {
    async getGroups() {
      let groups = [];
      const groupsFetched = this.$store.getters.getFetchedGroups();
      if (groupsFetched[0]) {
        // Already fetched
        groups = groupsFetched[1];
      } else {
        // Not fetched yet
        groups =
          (await this.$store.dispatch("fetchGroups").catch(error => {
            console.error(error);
          })) || [];
      }
      this.groups = groups
        .filter(({ isWorkingGroup }) => !!isWorkingGroup)
        .sort((a, b) => a.name.localeCompare(b.name, "de", { sensitivity: "base" }));
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  created() {
    this.getGroups();
  }
};
</script>

<style></style>
