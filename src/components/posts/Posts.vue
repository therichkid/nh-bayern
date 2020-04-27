<template>
  <div>
    <LoadingSkeleton type="posts" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getPosts(page, groupName)" />

    <v-row v-if="!isLoading && !loadingError && posts.length">
      <v-col v-for="article in posts" :key="article.id" cols="12">
        <v-card
          hover
          :to="`/news/${article.slug}`"
          :style="{
            'border-top': `6px solid ${article.color || 'var(--v-primary-base)'}`
          }"
        >
          <v-row no-gutters>
            <!-- Image -->
            <v-col cols="auto">
              <v-avatar class="ma-2" size="200" style="border-radius: 4px;">
                <v-img
                  :src="article.featuredImage.source"
                  :alt="article.featuredImage.title"
                ></v-img>
              </v-avatar>
            </v-col>

            <!-- Text -->
            <v-col class="d-flex flex-column">
              <v-chip-group column class="px-3">
                <v-chip
                  :color="article.color || 'primary'"
                  text-color="white"
                  v-for="category in article.categories"
                  :key="category.name"
                >
                  {{ category.name }}
                </v-chip>
              </v-chip-group>
              <v-card-title class="pt-0">
                <h3 class="headline">{{ article.title }}</h3>
              </v-card-title>
              <v-card-subtitle>
                <v-row align="center">
                  <v-col cols="12">
                    <v-icon :color="article.color || 'primary'" class="pr-1">mdi-calendar</v-icon>
                    <span class="mr-2">{{ article.date }}</span>
                    <v-icon :color="article.color || 'primary'" class="pr-1">mdi-account</v-icon>
                    <span>{{ article.author }}</span>
                  </v-col>
                </v-row>
              </v-card-subtitle>
              <v-card-text>
                <div v-html="article.excerpt"></div>
              </v-card-text>
              <v-spacer></v-spacer>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-icon>mdi-chevron-right</v-icon>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <NoContentYet v-if="!isLoading && !loadingError && !posts.length" />
  </div>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
import NoContentYet from "@/components/partials/NoContentYet";
const LoadingError = () =>
  import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    LoadingSkeleton,
    LoadingError,
    NoContentYet
  },

  props: {
    page: Number,
    groupName: String
  },

  data() {
    return {
      posts: []
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.postsLoading;
    },
    loadingError() {
      return this.$store.state.postsLoadingError;
    }
  },

  watch: {
    $route() {
      this.getPosts(this.page, this.groupName);
    }
  },

  methods: {
    async getPosts(page, groupName) {
      // Overwrite groupName with query param if it exists
      if (this.$route.query.selection) {
        groupName = this.$route.query.selection;
      }
      const postsFetched = this.$store.getters.getFetchedPosts(page, groupName);
      if (postsFetched[0]) {
        // Already fetched
        this.posts = postsFetched[1];
      } else {
        // Not fetched yet
        this.posts = await this.$store
          .dispatch("fetchPosts", { page, groupName })
          .catch(error => console.error(error));
      }
      if (groupName) {
        this.$emit("postPagesInit", this.$store.state.totalPostPagesPerGroup[groupName]);
      } else {
        this.$emit("postPagesInit", this.$store.state.totalPostPages);
      }
    }
  },

  created() {
    this.getPosts(this.page, this.groupName);
  }
};
</script>

<style></style>
