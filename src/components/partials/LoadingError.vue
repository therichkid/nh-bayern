<template>
  <div :style="{ height: height + 'px' }">
    <v-alert type="error" prominent>
      <v-row align="center">
        <v-col class="grow">Laden fehlgeschlagen...</v-col>
        <v-col class="shrink">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon large @click="retryAgain()" v-on="on" aria-label="Neu laden">
                <v-icon large>mdi-reload</v-icon>
              </v-btn>
            </template>
            <span>Neu laden</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-alert>
  </div>
</template>

<script>
export default {
  props: {
    height: Number
  },

  computed: {
    failedRequests() {
      return this.$store.state.failedRequests;
    }
  },

  methods: {
    retryAgain() {
      this.$emit("retryAgain");
    }
  },

  mounted() {
    // Automatically try again after 5 seconds
    if (this.failedRequests < 5) {
      setTimeout(() => {
        this.retryAgain();
      }, 5000);
    }
  }
};
</script>

<style></style>
