<template>
  <div>
    <v-menu v-if="!isHidden" v-model="isOpen" offset-y max-height="75%">
      <template v-slot:activator="scope">
        <v-text-field
          @click="scope.value = true"
          @keydown="scope.value = true"
          v-model="model"
          :loading="isLoading"
          placeholder="Nach Neuigkeiten & Veranstaltungen suchen"
          solo
          flat
          hide-details
          autofocus
          :light="!$vuetify.theme.dark"
          prepend-inner-icon="mdi-magnify"
          append-icon="mdi-close"
          @click:append="toggleSearchBar"
          style="width: 55vw; max-width: 600px;"
        ></v-text-field>
      </template>
      <v-list>
        <v-subheader>
          Neuigkeiten
          <v-spacer></v-spacer>
          <v-switch dense v-model="includePosts"></v-switch>
        </v-subheader>
        <v-list-item v-for="post in items.posts" :key="post.id" :to="`/news/${post.slug}`">
          <v-list-item-content>
            <v-list-item-title v-html="post.title.rendered"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text>{{ formatDate(post, "post") }}</v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
        <v-subheader>
          Veranstaltungen
          <v-spacer></v-spacer>
          <v-switch dense v-model="includeEvents"></v-switch>
        </v-subheader>
        <v-list-item
          v-for="event in items.events"
          :key="event.id"
          :to="`/events/${event.acf.event_datum}/${event.slug}`"
        >
          <v-list-item-content>
            <v-list-item-title v-html="event.title.rendered"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text>{{ formatDate(event, "event") }}</v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn icon text v-if="isHidden" @click.stop="toggleSearchBar()" aria-label="Suche öffnen">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: { posts: [], events: [] },
      isLoading: false,
      isHidden: true,
      isOpen: false,
      model: null,
      includePosts: true,
      includeEvents: true,
      timeout: null,
      isInit: false
    };
  },

  watch: {
    model(value) {
      // Call with simple debounce
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.search(value);
      }, 150);
    },
    includePosts() {
      this.search(this.model);
    },
    includeEvents() {
      this.search(this.model);
    }
  },

  methods: {
    toggleSearchBar() {
      this.isHidden = !this.isHidden;
      if (this.isHidden) {
        this.model = null;
      } else {
        // Already present search results on first open
        if (!this.isInit) {
          this.search();
          this.isInit = true;
        }
      }
    },
    async search(value) {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      const perPage = this.includePosts && this.includeEvents ? 5 : 10;
      const fetchPosts = this.includePosts
        ? this.$store.dispatch("fetchPostsBySearchTerm", { search: value, perPage })
        : [];
      const fetchEvents = this.includeEvents
        ? this.$store.dispatch("fetchEventsBySearchTerm", { search: value, perPage })
        : [];
      const [posts, events] = await Promise.all([fetchPosts, fetchEvents])
        .catch(error => console.error(error))
        .finally(() => {
          this.isLoading = false;
        });
      // Re-open menu on mobile...
      // ...if there are search results now but none before
      const cond1 =
        (posts.length || events.length) && !this.items.posts.length && !this.items.events.length;
      // ...or if there were search results before but none now
      const cond2 =
        (this.items.posts.length || this.items.events.length) && !posts.length && !events.length;
      if (this.$vuetify.breakpoint.smAndDown && (cond1 || cond2)) {
        this.isOpen = false;
      }
      setTimeout(() => {
        this.isOpen = true;
      });
      this.items.posts = posts;
      this.items.events = events;
    },
    formatDate(item, type) {
      const date = type === "post" ? item.date : item.acf.event_datum;
      return date.slice(8, 10) + "." + date.slice(5, 7) + "." + date.slice(2, 4);
    }
  }
};
</script>

<style></style>
