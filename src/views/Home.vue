<template>
  <div>
    <v-container>
      <InfoMessage />

      <v-row align="center">
        <v-col cols="auto" class="mr-auto">
          <h1 class="display-1 mb-2" style="word-wrap: break-word;">Neuigkeiten</h1>
        </v-col>
        <v-col cols="auto">
          <CategoryInfo />
        </v-col>
      </v-row>

      <Posts :page="1" />
    </v-container>
    <div class="text-center">
      <v-btn :disabled="postPages < 2" large color="primary" @click="loadMorePosts()" class="mb-2"
        >Mehr Neuigkeiten</v-btn
      >
    </div>
    <Events />
  </div>
</template>

<script>
import Posts from "@/components/posts/Posts";
import InfoMessage from "@/components/partials/InfoMessage";
import CategoryInfo from "@/components/partials/CategoryInfo";
const Events = () => import(/* webpackChunkName: "events" */ "@/components/events/Events");

export default {
  components: {
    Posts,
    Events,
    InfoMessage,
    CategoryInfo
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
