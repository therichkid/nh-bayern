<template>
  <v-container>
    <v-row align="center">
      <v-col cols="auto" class="mr-auto">
        <h1 class="display-1 mb-2" style="word-wrap: break-word">Netzwerk</h1>
      </v-col>
      <v-col cols="auto">
        <CategoryInfo />
      </v-col>
    </v-row>

    <!-- Network -->
    <LoadingSkeleton type="network" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getGroups()" />

    <v-row v-if="!isLoading && !loadingError && groups.length" :dense="$vuetify.breakpoint.xsOnly">
      <v-col cols="6" sm="4" lg="3" v-for="group in groups" :key="group.id" class="d-flex">
        <v-card
          hover
          :to="`/netzwerk/${group.slug}`"
          class="d-flex flex-column"
          :style="{
            'border-top': `6px solid ${group.color || 'var(--v-primary-base)'}`
          }"
        >
          <v-img
            :src="group.featuredImage.source"
            :alt="group.featuredImage.title"
            max-height="250"
            style="border-radius: 0"
          >
          </v-img>
          <v-chip-group column class="px-3">
            <v-chip
              :color="group.color || 'primary'"
              text-color="white"
              v-for="category in group.categories"
              :key="category.name"
              small
            >
              {{ category.name }}
            </v-chip>
          </v-chip-group>
          <v-card-title class="pt-0">
            <h3 class="subtitle-2" style="word-wrap: break-word; hyphens: auto">
              {{ group.name }}
            </h3>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-icon>mdi-chevron-right</v-icon>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- WordPress page -->
    <LoadingSkeleton type="page" v-if="isLoadingPage" />
    <LoadingError v-if="loadingErrorPage" :height="500" @retryAgain="getPageBySlug('netzwerk')" />
    <v-row v-if="!isLoadingPage && !loadingErrorPage && page" align="center">
      <!-- Body -->
      <v-col cols="12" v-html="page.content" :style="{ fontSize: fontSize + 'px' }"></v-col>
      <!-- Social media -->
      <v-col cols="12">
        <SocialMedia link="/netzwerk" title="Netzwerk" />
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
import CategoryInfo from "@/components/partials/CategoryInfo";
import SocialMedia from "@/components/partials/SocialMedia";
const LoadingError = () =>
  import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    LoadingSkeleton,
    LoadingError,
    CategoryInfo,
    SocialMedia
  },

  data() {
    return {
      groups: [],
      page: {}
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.groupsLoading;
    },
    loadingError() {
      return this.$store.state.groupsLoadingError;
    },
    isLoadingPage() {
      return this.$store.state.pageLoading;
    },
    loadingErrorPage() {
      return this.$store.state.pageLoadingError;
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
      this.groups = groups.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    },
    async getPageBySlug(slug) {
      const pageFetched = this.$store.getters.getFetchedPageBySlug(slug);
      if (pageFetched[0]) {
        // Already fetched
        this.page = pageFetched[1];
      } else {
        // Not fetched yet
        this.page = await this.$store.dispatch("fetchPageBySlug", slug).catch(error => {
          console.error(error);
        });
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  created() {
    this.getGroups();
    this.getPageBySlug("netzwerk");
  }
};
</script>

<style></style>
