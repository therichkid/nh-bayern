<template>
  <v-footer dark :class="$vuetify.theme.dark ? 'dark-gradient' : 'light-gradient'">
    <v-row align="center">
      <!-- Left -->
      <v-col cols="12" sm="6">
        <!-- Contact -->
        <v-card-title :class="$vuetify.breakpoint.xsOnly && 'justify-center'">Kontakt</v-card-title>
        <v-card-text>
          <div class="align-center mb-2" v-for="(item, i) in contact" :key="i">
            <v-icon color="secondary" class="icon">{{ item.icon }}</v-icon>
            <span class="body-2 text link" v-html="item.text"></span>
          </div>
        </v-card-text>
      </v-col>
      <!-- Right -->
      <v-col cols="12" sm="6">
        <!-- Newsletter -->
        <v-card-title :class="$vuetify.breakpoint.xsOnly && 'justify-center'"
          >Newsletter abonnieren</v-card-title
        >
        <v-form v-model="valid">
          <v-card-text>
            <v-text-field
              solo-inverted
              label="E-Mail"
              v-model="email"
              :rules="emailRules"
              required
            ></v-text-field>
            <v-btn class="secondary" :disabled="!valid || !email" @click="sendForm"
              >Abonnieren</v-btn
            >
            <div class="caption link mt-2">
              Diese Website ist durch reCAPTCHA geschützt und es gelten die
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                >Datenschutzbestimmungen</a
              >
              und
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer"
                >Nutzungsbedingungen</a
              >
              von Google.
            </div>
          </v-card-text>
        </v-form>
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
        <strong>Bayerischer Cochlea Implantat Verband e.V.</strong>
      </v-col>
    </v-row>

    <AlertModal
      :dialog="dialog"
      :alertType="alertType"
      :alertMessage="alertMessage"
      page="newsletter"
      @dialog="dialog = false"
    />
  </v-footer>
</template>

<script>
import api from "@/services/api";
const AlertModal = () =>
  import(/* webpackChunkName: "dialog" */ "@/components/partials/AlertModal");

export default {
  components: {
    AlertModal
  },

  data() {
    return {
      valid: false,
      email: "",
      emailRules: [v => /\S+@\S+\.\S+/.test(v) || !v || "Diese E-Mail ist ungültig!"],
      dialog: false,
      alertMessage: "",
      alertType: "",
      contact: [
        {
          icon: "mdi-map-marker",
          text: `Bayerischer Cochlea Implantat Verband e.V.
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
          text: "info(at)bayciv.de"
        },
        {
          icon: "mdi-facebook",
          text:
            "<a href='https://www.facebook.com/bayciv' target='_blank' rel='noopener noreferrer'>Facebook</a>"
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
  },

  methods: {
    async sendForm() {
      const data = {
        email: this.email.trim()
      };
      // Create token for reCAPTCHA
      const token = await this.$recaptcha("login");
      await api
        .postData(data, token, "newsletter")
        .then(response => {
          this.alertType = "success";
          this.alertMessage = response;
          this.email = "";
        })
        .catch(error => {
          this.alertType = "error";
          this.alertMessage = error;
        });
      this.dialog = true;
    }
  }
};
</script>

<style scoped>
.light-gradient {
  background: linear-gradient(var(--v-primary-lighten2), var(--v-primary-base));
}
.dark-gradient {
  background: linear-gradient(var(--v-primary-darken2), var(--v-primary-base));
}
.icon {
  float: left;
}
.text {
  display: block;
  padding-left: 60px;
}
.link >>> a {
  color: var(--v-secondary-base);
}
</style>
