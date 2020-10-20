<template>
  <v-card v-if="info" dark :color="info.type" class="mb-4">
    <v-card-title :class="info.link && 'pb-0'">
      <v-icon v-if="info.type === 'success' && $vuetify.breakpoint.smAndUp" class="mr-4">
        mdi-check-circle
      </v-icon>
      <v-icon v-if="info.type === 'info' && $vuetify.breakpoint.smAndUp" class="mr-4">
        mdi-information
      </v-icon>
      <h3
        :class="info.teaser && info.teaser.length < 100 ? 'headline' : 'subtitle-1'"
        style="flex: 1; word-wrap: break-word; hyphens: auto; text-align: justify"
      >
        {{ info.teaser }}
      </h3>
    </v-card-title>
    <v-card-actions v-if="info.link">
      <v-spacer></v-spacer>
      <v-btn text v-bind="linkProps">{{ info.buttonText || "Mehr Infos" }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      info: null,
      linkProps: {}
    };
  },

  methods: {
    async getInfo() {
      this.info = await this.$store.dispatch("fetchPageBySlug", "info-meldung").catch(error => {
        console.error(error);
      });
      if (this.info) {
        if (this.info.link) {
          if (this.info.link.match(/http|www/i)) {
            // External link
            if (!this.info.link.includes("http")) {
              this.info.link = `https://${this.info.link}`;
            }
            this.linkProps = {
              href: this.info.link,
              target: "_blank",
              rel: "noopener noreferrer"
            };
          } else {
            // Internal link
            this.linkProps = {
              to: this.info.link
            };
          }
        } else {
          const content = this.stripHtml(this.info.content);
          if (content) {
            this.info.link = this.info.slug;
            // Add a link to itself to show as a page
            this.linkProps = {
              to: this.info.link
            };
          }
        }
      }
    },
    stripHtml(content) {
      const div = document.createElement("div");
      div.innerHTML = content;
      const text = div.textContent;
      return text.trim();
    }
  },

  created() {
    this.getInfo();
  }
};
</script>

<style></style>
