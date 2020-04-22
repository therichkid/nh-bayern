<template>
  <div>
    <v-container>
      <InfoMessage />

      <h1 class="display-1 mb-2">Neuigkeiten</h1>
      <Posts :page="1" />
    </v-container>
    <div class="text-center">
      <v-btn :disabled="postPages < 2" large color="primary" @click="loadMorePosts()" class="mb-2"
        >Mehr Neuigkeiten</v-btn
      >
    </div>
    <Events />
    <Events type="mainEvents" />
  </div>
</template>

<script>
import Posts from "@/components/posts/Posts";
import InfoMessage from "@/components/partials/InfoMessage";
const Events = () => import(/* webpackChunkName: "events" */ "@/components/events/Events");

export default {
  components: {
    Posts,
    Events,
    InfoMessage
  },

  computed: {
    postPages() {
      return this.$store.state.totalPostPages;
    }
  },

  methods: {
    loadMorePosts() {
      this.$router.push("/news/page/2");
    }
  }
};
</script>

<style></style>
