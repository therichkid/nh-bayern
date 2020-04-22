<template>
  <v-navigation-drawer v-model="drawer" clipped app overflow width="300">
    <template v-if="$vuetify.breakpoint.mdAndDown">
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="@/assets/logo_blue.png" alt="BayCIV-Logo"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title">
            BayCIV
          </v-list-item-title>
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
          icon: "mdi-newspaper",
          title: "Neuigkeiten",
          to: "/news"
        },
        {
          icon: "mdi-calendar",
          title: "Veranstaltungen",
          to: "/events"
        },
        {
          icon: "mdi-account-multiple",
          title: "Selbsthilfegruppen",
          to: "/shgs"
        },
        {
          icon: "mdi-ear-hearing",
          title: "Cochlea-Implantat",
          to: [
            {
              title: "Erfahrungen",
              to: "/erfahrungen"
            },
            {
              title: "Was ist ein CI?",
              to: "/was-ist-ein-ci"
            },
            {
              title: "Kliniken, Rehas, Beratungsstellen",
              to: "/einrichtungen"
            },
            {
              title: "CI-Systeme",
              to: "/ci-systeme"
            }
          ]
        },
        {
          icon: "mdi-information",
          title: "Über uns",
          to: [
            {
              title: "Verband",
              to: "/verband"
            },
            {
              title: "Beratung",
              to: "/beratung"
            },
            {
              title: "Vorstand",
              to: "/vorstand"
            },
            {
              title: "Förderer",
              to: "/foerderer"
            },
            {
              title: "Satzung",
              to: "/satzung"
            },
            {
              title: "Infos & Dokumente",
              to: "/infos-dokumente"
            }
          ]
        },
        {
          icon: "mdi-clipboard-account",
          title: "Kontakt",
          to: "/kontakt"
        },
        {
          icon: "mdi-account-plus",
          title: "Mitglied werden",
          to: "/mitglied-werden"
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
