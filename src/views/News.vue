<template>
  <v-container>
    <v-row align="center">
      <v-col cols="auto" class="mr-auto">
        <h1 class="display-1 mb-2">Neuigkeiten</h1>
      </v-col>
      <v-col cols="auto">
        <CategoryInfo />
      </v-col>
    </v-row>

    <v-btn-toggle v-model="selection" mandatory style="overflow-x: auto">
      <v-btn value="all">Alle</v-btn>
      <v-btn value="presse">Presse</v-btn>
      <v-btn value="woche-der-kommunikation">Woche der Kommunikation</v-btn>
      <v-btn value="woche-der-seniorinnen">Woche der Senior*innen</v-btn>
    </v-btn-toggle>

    <Posts :page="page" @postPagesInit="postPages = $event"></Posts>
    <div class="text-center">
      <v-pagination v-model="page" :length="postPages" @input="changePage()"></v-pagination>
    </div>
  </v-container>
</template>

<script>
import Posts from "@/components/posts/Posts";
import CategoryInfo from "@/components/partials/CategoryInfo";

export default {
  components: {
    Posts,
    CategoryInfo
  },

  data() {
    return {
      page: parseInt(this.$route.params.page, 10) || 1,
      selection: this.$route.query.selection || "all",
      postPages: 0,
      isSelectionDisabled: false
    };
  },

  watch: {
    $route() {
      this.disableSelection();
      this.page = parseInt(this.$route.params.page, 10) || 1;
      this.selection = this.$route.query.selection || "all";
    },
    selection() {
      if (this.isSelectionDisabled) {
        return;
      }
      this.page = 1;
      this.changePage();
    }
  },

  methods: {
    changePage() {
      if (
        this.page === parseInt(this.$route.params.page, 10) &&
        (this.selection === this.$route.query.selection ||
          (!this.$route.query.selection && this.selection === "all"))
      ) {
        return;
      }
      const route = {
        name: "news",
        params: { page: this.page }
      };
      if (this.selection !== "all") {
        // Add selection as query params to route
        route.query = { selection: this.selection };
      }
      this.$router.push(route);
    },
    disableSelection() {
      this.isSelectionDisabled = true;
      setTimeout(() => {
        this.isSelectionDisabled = false;
      }, 100);
    }
  }
};
</script>

<style></style>
