<template>
  <v-navigation-drawer v-model="drawer" clipped app overflow width="300">
    <template v-if="$vuetify.breakpoint.mdAndDown">
      <v-list-item>
        <v-list-item-avatar tile>
          <v-img src="@/assets/logo.png" contain alt="NH Bayern-Logo"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title"> NH Bayern </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
    </template>

    <v-list nav dense shaped>
      <template v-for="(item, i) in routerItems">
        <v-list-item :key="i" :to="item.to" v-if="typeof item.to === 'string'">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group :prepend-icon="item.icon" :key="i" v-if="typeof item.to === 'object'">
          <template v-slot:activator>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </template>
          <v-list-item v-for="(item, i) in item.to" :key="i" :to="item.to">
            <v-list-item-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      routerItems: [
        {
          icon: "mdi-home",
          title: "Home",
          to: "/"
        },
        {
          icon: "mdi-calendar",
          title: "Veranstaltungen",
          to: "/events"
        },
        {
          icon: "mdi-account-multiple",
          title: "Netzwerk",
          to: "/netzwerk"
        },
        {
          icon: "mdi-account-group",
          title: "Arbeitskreise",
          to: "/arbeitskreise"
        },
        {
          icon: "mdi-information",
          title: "Über uns",
          to: [
            {
              title: "Ziele",
              to: "/ziele"
            },
            {
              title: "Infomaterial",
              to: "/infomaterial"
            },
            {
              title: "Stellungnahmen",
              to: "/stellungnahmen"
            }
          ]
        },
        {
          icon: "mdi-newspaper",
          title: "Neuigkeiten",
          to: "/news"
        },
        {
          icon: "mdi-clipboard-account",
          title: "Kontakt",
          to: "/kontakt"
        }
      ]
    };
  },

  mounted() {
    if (this.$vuetify.breakpoint.lgAndUp) {
      this.drawer = true;
    }
  }
};
</script>

<style></style>
