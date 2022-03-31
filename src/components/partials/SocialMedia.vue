<template>
  <div class="text-right" style="min-height: 48px">
    <span v-for="network in networks" :key="network.name">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            :href="createLink(network.name)"
            target="_blank"
            rel="nofollow"
            class="mx-1 white--text"
            :style="{ backgroundColor: network.color }"
            :aria-label="`Per ${network.label} teilen`"
          >
            <v-icon>mdi-{{ network.name }}</v-icon>
          </v-btn>
        </template>
        <span>Per {{ network.label }} teilen</span>
      </v-tooltip>
    </span>

    <!-- Clipboard -->
    <v-tooltip top v-if="type !== 'popup'">
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
          @click="copyToClipboard()"
          class="white--text"
          :class="$vuetify.breakpoint.mdAndUp ? 'mx-1' : 'ml-1'"
          style="background-color: #607d8b"
          aria-label="Link in die Zwischenablage kopieren"
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
      </template>
      <span>Link in die Zwischenablage kopieren</span>
    </v-tooltip>
    <v-snackbar v-model="snackbar">
      Link erfolgreich in die Zwischenablage kopiert.
      <v-btn icon dark @click="snackbar = false" aria-label="Schließen">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <!-- Print -->
    <v-menu top left offset-y v-if="$vuetify.breakpoint.mdAndUp">
      <template v-slot:activator="{ on: menu }">
        <v-tooltip top>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              icon
              v-on="{ ...menu, ...tooltip }"
              class="ml-1 white--text"
              style="background-color: #2196f3"
              aria-label="Drucken"
            >
              <v-icon>mdi-printer</v-icon>
            </v-btn>
          </template>
          <span>Drucken</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-item @click="printPage(true)">
          <v-list-item-title>Mit Bildern</v-list-item-title>
        </v-list-item>
        <v-list-item @click="printPage(false)">
          <v-list-item-title>Ohne Bilder</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    link: String,
    title: String,
    type: String
  },

  data() {
    return {
      networks: [
        {
          name: "email",
          label: "E-Mail",
          color: "#d44638"
        },
        {
          name: "facebook",
          label: "Facebook",
          color: "#4267b2"
        },
        {
          name: "twitter",
          label: "Twitter",
          color: "#1da1f2"
        },
        {
          name: "whatsapp",
          label: "WhatsApp",
          color: "#4ac959"
        }
      ],
      linkPrefix: "https://www.nh-bayern.de",
      snackbar: false
    };
  },

  computed: {
    url() {
      return this.linkPrefix + this.link;
    }
  },

  methods: {
    createLink(network) {
      const url = encodeURIComponent(this.url);
      const title = encodeURIComponent(this.title);
      switch (network) {
        case "email":
          return `mailto:?subject=${title}&body=${url}`;
        case "facebook":
          return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        case "twitter":
          return `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        case "whatsapp":
          return `https://wa.me/?text=${url}`;
      }
    },
    copyToClipboard() {
      // copy needs a dom element
      const el = document.createElement("textarea");
      el.value = this.url;
      // Make the element invisible to the user
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      this.snackbar = true;
    },
    async printPage(withImg) {
      if (!withImg) {
        document.body.classList.add("no-img");
      }
      if (this.type === "popup") {
        await this.$router.push(this.link);
        window.print();
        this.$router.go(-1);
        document.body.classList.remove("no-img");
      } else {
        // Wait until the menu close animation finished
        setTimeout(() => {
          window.print();
          document.body.classList.remove("no-img");
        }, 100);
      }
    }
  }
};
</script>

<style></style>
