<template>
  <v-footer dark :class="$vuetify.theme.dark ? 'dark-gradient' : 'light-gradient'">
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="auto">
          <!-- Contact -->
          <v-card-title class="justify-center">Kontakt</v-card-title>
          <v-card-text>
            <div class="mb-2" v-for="(item, i) in contact" :key="i">
              <v-icon color="secondary" class="icon">{{ item.icon }}</v-icon>
              <span class="body-2 text link" v-html="item.text"></span>
            </div>
            <div>
              <v-icon color="secondary" class="icon">mdi-pencil</v-icon>
              <span class="body-2 text link">
                <router-link to="/kontakt">Zum Kontaktformular</router-link>
              </span>
            </div>
            <!-- mdi-pencil -->
          </v-card-text>
        </v-col>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <!-- Bottom links and copyright -->
        <v-col cols="12" sm="6" class="text-center text-sm-left">
          <v-btn v-for="(item, i) in menu" :key="i" text :to="item.to">
            {{ item.name }}
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6" class="text-center text-sm-right">
          &copy; {{ new Date().getFullYear() }} &minus;
          <strong>Netzwerk Hörbehinderung Bayern</strong>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      contact: [
        {
          icon: "mdi-map-marker",
          text: `Netzwerk Hörbehinderung Bayern
          <br>Arberweg 28
          <br>85748 Garching`
        },
        {
          icon: "mdi-phone",
          text: "<a href='tel:+498932928926'>+49 (0) 89 329 28 926</a>"
        },
        {
          icon: "mdi-fax",
          text: "<a href='tel:+4932223768123'>+49 (0) 3 222 376 8123</a>"
        },
        {
          icon: "mdi-email",
          text: "info(at)nh-bayern.de"
        }
      ],
      menu: [
        {
          name: "Datenschutz",
          to: "/datenschutz"
        },
        {
          name: "Impressum",
          to: "/impressum"
        }
      ]
    };
  }
};
</script>

<style scoped>
.light-gradient {
  background: linear-gradient(var(--v-primary-lighten1), var(--v-primary-base));
}
.dark-gradient {
  background: linear-gradient(var(--v-primary-darken1), var(--v-primary-base));
}
.icon {
  float: left;
  margin-top: -3px;
}
.text {
  display: block;
  padding-left: 60px;
}
.link >>> a {
  color: #fff;
}
</style>
