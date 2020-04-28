<template>
  <v-container class="post-container">
    <LoadingSkeleton v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getPostBySlug(slug)" />

    <v-row v-if="!isLoading && !loadingError && Object.keys(post).length" align="center">
      <!-- Header -->
      <v-col cols="12">
        <h1 class="display-1">{{ post.title }}</h1>
      </v-col>

      <!-- Body -->
      <v-col cols="12">
        <v-icon color="primary" class="pr-1">mdi-calendar</v-icon>
        <span class="mr-2">{{ post.date }}</span>
        <v-icon color="primary" class="pr-1">mdi-account</v-icon>
        <span class="mr-2">{{ post.author }}</span>
        <!-- Categories -->
        <template v-if="post.categories.length">
          <v-icon color="primary" class="pr-1">mdi-tag</v-icon>
          <span v-for="(category, i) in post.categories" :key="i">
            <span v-if="i !== 0">, </span>
            <router-link :to="'/netzwerk/' + category.slug" v-if="category.type === 'group'">{{
              category.name
            }}</router-link>
            <span v-else>{{ category.name }}</span>
          </span>
        </template>
      </v-col>
      <v-col cols="12" v-html="post.content" :style="{ fontSize: fontSize + 'px' }"></v-col>
      <!-- Social media -->
      <v-col cols="12">
        <SocialMedia :link="'/news/' + slug" :title="post.title" />
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
import SocialMedia from "@/components/partials/SocialMedia";
const LoadingError = () =>
  import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    LoadingSkeleton,
    LoadingError,
    SocialMedia
  },

  props: {
    slug: String
  },

  data() {
    return {
      post: {}
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.postsLoading;
    },
    loadingError() {
      return this.$store.state.postsLoadingError;
    },
    fontSize() {
      return this.$store.state.fontSize;
    },
    failedRequests() {
      return this.$store.state.failedRequests;
    }
  },

  watch: {
    post(post) {
      if (!post && !this.failedRequests) {
        this.$router.push("/404");
      }
    },
    $route() {
      this.getPostBySlug(this.slug);
    }
  },

  methods: {
    async getPostBySlug(slug) {
      const postFetched = this.$store.getters.getFetchedPostBySlug(slug);
      if (postFetched[0]) {
        // Already fetched
        this.post = postFetched[1];
      } else {
        // Not fetched yet
        this.post = await this.$store.dispatch("fetchPostBySlug", slug).catch(error => {
          console.error(error);
        });
      }
      if (this.post) {
        document.title = this.post.title + " - " + document.title;
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  created() {
    this.getPostBySlug(this.slug);
  }
};
</script>

<style></style>
