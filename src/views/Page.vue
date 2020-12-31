<template>
  <v-container class="post-container">
    <LoadingSkeleton v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getPageBySlug(slug)" />

    <v-row v-if="!isLoading && !loadingError && page" align="center">
      <!-- Header -->
      <v-col cols="12">
        <h1 class="display-1">{{ page.title }}</h1>
      </v-col>

      <!-- Body -->
      <v-col cols="12" v-if="page.slug === 'datenschutz'">
        <div>
          Klicken Sie auf den folgenden Knopf, um alle Cookies auf dieser Seite zurückzusetzen. Im
          Anschluss können Sie Ihre Wahl zu den Cookies erneut treffen.
        </div>
        <v-btn @click="resetCookies()" class="mt-2">Cookies zurücksetzen</v-btn>
      </v-col>

      <v-col cols="12" v-html="page.content" :style="{ fontSize: fontSize + 'px' }"></v-col>
      <!-- Social media -->
      <v-col cols="12">
        <SocialMedia :link="'/' + slug" :title="page.title" />
      </v-col>

      <!-- Actions -->
      <v-col cols="12" v-if="page.formId && page.formData && page.formData.length">
        <Form type="page" :formIdProp="page.formId" :formDataProp="page.formData" />
      </v-col>
      <v-col cols="12" v-else>
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
const Form = () => import(/* webpackChunkName: "form" */ "@/views/Form");

export default {
  components: {
    LoadingSkeleton,
    LoadingError,
    Form,
    SocialMedia
  },

  props: {
    slug: String
  },

  data() {
    return {
      page: {}
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.pageLoading;
    },
    loadingError() {
      return this.$store.state.pageLoadingError;
    },
    fontSize() {
      return this.$store.state.fontSize;
    },
    failedRequests() {
      return this.$store.state.failedRequests;
    }
  },

  watch: {
    page(page) {
      if (!page && !this.failedRequests) {
        this.$router.push("/404");
      }
    },
    $route() {
      this.getPageBySlug(this.slug);
    }
  },

  methods: {
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
      if (this.page) {
        document.title = this.page.title + " - " + document.title;
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    resetCookies() {
      document.cookie.split(";").forEach(cookie => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      localStorage.clear();
      window.location.href = "/";
    }
  },

  created() {
    this.getPageBySlug(this.slug);
  }
};
</script>

<style></style>
