<template>
  <div>
    <LoadingSkeleton type="group" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="250" @retryAgain="getGroup(groupName)" />

    <v-row v-if="!isLoading && !loadingError && Object.keys(group).length">
      <v-chip-group column class="px-3">
        <v-chip
          :color="group.color || 'primary'"
          text-color="white"
          v-for="category in group.categories"
          :key="category.name"
        >
          {{ category.name }}
        </v-chip>
      </v-chip-group>

      <v-col cols="12">
        <h1 class="display-1" style="word-wrap: break-word;">{{ group.name }}</h1>
      </v-col>
      <!-- 1st column -->
      <v-col cols="12" sm="4">
        <v-img
          :src="group.featuredImage.source"
          maxHeight="300px"
          contain
          alt="Logo des Verbands"
        ></v-img>
      </v-col>
      <!-- 2nd column -->
      <v-col cols="12" sm="4">
        <v-card-title>Adresse</v-card-title>
        <v-card-text>
          <!-- Main address -->
          <div class="align-center">
            <v-icon color="primary" class="icon">mdi-map-marker</v-icon>
            <span class="body-2 text" v-html="group.address.split(', ').join('<br />')"></span>
          </div>
          <!-- Secondary address -->
          <div class="align-center mt-4" v-if="group.address2">
            <v-icon color="primary" class="icon">mdi-map-marker</v-icon>
            <span class="body-2 text" v-html="group.address2.split(', ').join('<br />')"></span>
          </div>
        </v-card-text>
      </v-col>
      <!-- 3rd column -->
      <v-col cols="12" sm="4" v-if="hasOptionalInfo">
        <v-card-title>Kontakt</v-card-title>
        <!-- Main contact info -->
        <v-card-text>
          <div class="align-center mb-2" v-if="group.phone">
            <v-icon color="primary" class="icon">mdi-phone</v-icon>
            <span
              class="body-2 text"
              v-html="`<a href='tel:${group.phone}'>${group.phone}</a>`"
            ></span>
          </div>
          <div class="align-center mb-2" v-if="group.mobile">
            <v-icon color="primary" class="icon">mdi-cellphone</v-icon>
            <span
              class="body-2 text"
              v-html="`<a href='tel:${group.mobile}'>${group.mobile}</a>`"
            ></span>
          </div>
          <div class="align-center mb-2" v-if="group.fax">
            <v-icon color="primary" class="icon">mdi-fax</v-icon>
            <span class="body-2 text" v-html="`<a href='tel:${group.fax}'>${group.fax}</a>`"></span>
          </div>
          <div class="align-center mb-2" v-if="group.email">
            <v-icon color="primary" class="icon">mdi-email</v-icon>
            <span class="body-2 text">{{ group.email }}</span>
          </div>
          <div class="align-center mb-2" v-if="group.homepage">
            <v-icon color="primary" class="icon">mdi-web</v-icon>
            <span
              class="body-2 text"
              v-html="
                `<a href='${
                  group.homepage.includes('http') ? group.homepage : 'https://' + group.homepage
                }' target='_blank' rel='noopener noreferrer'>${group.homepage}</a>`
              "
            ></span>
          </div>
          <!-- Secondary contact info -->
          <div v-if="hasOptionalSecondaryInfo" class="mt-4">
            <div class="align-center mb-2" v-if="group.phone2">
              <v-icon color="primary" class="icon">mdi-phone</v-icon>
              <span
                class="body-2 text"
                v-html="`<a href='tel:${group.phone2}'>${group.phone2}</a>`"
              ></span>
            </div>
            <div class="align-center mb-2" v-if="group.mobile2">
              <v-icon color="primary" class="icon">mdi-cellphone</v-icon>
              <span
                class="body-2 text"
                v-html="`<a href='tel:${group.mobile2}'>${group.mobile2}</a>`"
              ></span>
            </div>
            <div class="align-center mb-2" v-if="group.fax2">
              <v-icon color="primary" class="icon">mdi-fax</v-icon>
              <span
                class="body-2 text"
                v-html="`<a href='tel:${group.fax2}'>${group.fax2}</a>`"
              ></span>
            </div>
            <div class="align-center mb-2" v-if="group.email2">
              <v-icon color="primary" class="icon">mdi-email</v-icon>
              <span class="body-2 text">{{ group.email2 }}</span>
            </div>
            <div class="align-center mb-2" v-if="group.homepage2">
              <v-icon color="primary" class="icon">mdi-web</v-icon>
              <span
                class="body-2 text"
                v-html="
                  `<a href='${
                    group.homepage2.includes('http')
                      ? group.homepage2
                      : 'https://' + group.homepage2
                  }' target='_blank' rel='noopener noreferrer'>${group.homepage2}</a>`
                "
              ></span>
            </div>
          </div>
        </v-card-text>
      </v-col>

      <!-- Content -->
      <v-col
        cols="12"
        v-html="group.content"
        :style="{ fontSize: fontSize + 'px', 'text-align': 'justify' }"
        v-if="group.content"
      ></v-col>
    </v-row>

    <Events :groupName="groupName" />

    <v-row>
      <v-col cols="12">
        <v-btn @click="goBack()">
          <v-icon>mdi-chevron-left</v-icon>
          <span>Zurück</span>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
const Events = () => import(/* webpackChunkName: "events" */ "@/components/events/Events");
const LoadingError = () =>
  import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    LoadingSkeleton,
    LoadingError,
    Events
  },

  props: {
    groupName: String
  },

  data() {
    return {
      group: {},
      hasOptionalInfo: false,
      hasOptionalSecondaryInfo: false
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.groupsLoading;
    },
    loadingError() {
      return this.$store.state.groupsLoadingError;
    },
    fontSize() {
      return this.$store.state.fontSize;
    }
  },

  watch: {
    $route() {
      this.getGroup(this.groupName);
    }
  },

  methods: {
    async getGroup(groupName) {
      let groups = [];
      const groupsFetched = this.$store.getters.getFetchedGroups();
      if (groupsFetched[0]) {
        // Already fetched
        groups = groupsFetched[1];
      } else {
        // Not fetched yet
        groups = await this.$store.dispatch("fetchGroups").catch(error => {
          console.error(error);
        });
      }
      for (const group of groups) {
        if (group.slug === groupName) {
          this.group = group;
          this.hasOptionalInfo = this.checkOptionalInfo(group);
          this.hasOptionalSecondaryInfo = this.checkOptionalSecondaryInfo(group);
          break;
        }
      }
      if (this.group) {
        document.title = this.group.name + " - " + document.title;
      }
    },
    checkOptionalInfo(group) {
      return !!group.email || !!group.phone || !!group.fax || !!group.homepage;
    },
    checkOptionalSecondaryInfo(group) {
      return !!group.email2 || !!group.phone2 || !!group.fax2 || !!group.homepage2;
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  created() {
    this.getGroup(this.groupName);
  }
};
</script>

<style scoped>
.icon {
  float: left;
}
.text {
  display: block;
  padding-left: 30px;
}
</style>
