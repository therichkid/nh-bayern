<template>
  <v-container class="post-container">
    <Loading v-if="isLoading" :height="500" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getEventBySlug(slug)" />

    <v-card v-if="!isLoading">
      <!-- Header -->
      <template v-if="type === 'event'">
        <v-card-title class="primary white--text">
          <span class="headline pr-2">{{ event.dayFormatted }}.</span>
          <span class="caption pt-2">{{ event.monthFormatted }}</span>
        </v-card-title>
        <v-card-title>
          <h3 class="headline">{{ event.title }}</h3>
        </v-card-title>
      </template>

      <template v-else>
        <v-card-title class="primary white--text">
          <h3 class="headline">Formular</h3>
        </v-card-title>
      </template>

      <!-- Body -->
      <v-card-text>
        <v-form v-model="valid">
          <div v-for="form in forms" :key="form.id">
            <div v-if="form.precedingText" v-html="form.precedingText" class="mt-3"></div>
            <!-- Text field -->
            <v-text-field
              v-if="textFieldTypes.indexOf(form.type) > -1"
              :type="form.type"
              :label="form.label"
              :rules="addFormRule(form)"
              v-model="form.value"
            ></v-text-field>
            <!-- Text area -->
            <v-textarea
              v-if="form.type === 'textarea'"
              :label="form.label"
              :rules="addFormRule(form)"
              v-model="form.value"
            ></v-textarea>
            <!-- Date picker -->
            <div v-if="form.type === 'date'" class="mt-3">
              <h3 v-if="form.label" class="subheading mb-2">{{ form.label }}</h3>
              <div>
                <v-date-picker
                  v-model="form.value"
                  locale="de-DE"
                  :first-day-of-week="1"
                ></v-date-picker>
              </div>
              <v-btn text v-if="form.value" @click="form.value = ''">
                <v-icon>mdi-undo</v-icon>
                <span class="ml-2 pt-1">Zurücksetzen</span>
              </v-btn>
            </div>
            <!-- Select -->
            <v-select
              v-if="form.type === 'select'"
              :label="form.label"
              :items="form.options"
              :chips="form.multiple"
              :multiple="form.multiple"
              :rules="addFormRule(form)"
              v-model="form.value"
              clearable
            ></v-select>
            <!-- Checkbox -->
            <template v-if="form.type === 'checkbox'">
              <v-checkbox
                v-for="item in form.options"
                :key="item"
                :label="item"
                :value="item"
                :rules="addFormRule(form)"
                v-model="form.value"
              ></v-checkbox>
            </template>
            <!-- Radio buttons -->
            <v-radio-group
              v-if="form.type === 'radio'"
              :label="form.label"
              :rules="addFormRule(form)"
              v-model="form.value"
            >
              <v-radio
                v-for="item in form.options"
                :key="item"
                :label="item"
                :value="item"
              ></v-radio>
            </v-radio-group>
          </div>
        </v-form>
        <div class="caption mt-2">
          Diese Website ist durch reCAPTCHA geschützt und es gelten die
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
            >Datenschutzbestimmungen</a
          >
          und
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer"
            >Nutzungsbedingungen</a
          >
          von Google.
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="goBack()">
          <v-icon>mdi-chevron-left</v-icon>
          <span>Zurück</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" right :disabled="!valid" :loading="isSending" @click="sendForm"
          >Senden</v-btn
        >
      </v-card-actions>
    </v-card>

    <AlertModal
      :dialog="dialog"
      :alertType="alertType"
      :alertMessage="alertMessage"
      page="form"
      @dialog="dialog = false"
    />
  </v-container>
</template>

<script>
import Loading from "@/components/partials/Loading";
import api from "@/services/api";
const LoadingError = () =>
  import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");
const AlertModal = () =>
  import(/* webpackChunkName: "dialog" */ "@/components/partials/AlertModal");

export default {
  components: {
    Loading,
    LoadingError,
    AlertModal
  },

  props: {
    slug: String,
    date: String,
    type: String,
    formIdProp: Number,
    formDataProp: String
  },

  data() {
    return {
      event: {},
      formId: 0,
      forms: [],
      textFieldTypes: ["text", "email", "url", "tel", "number"],
      valid: false,
      mandatoryRules: [v => !!v || "Dies ist ein Pflichtfeld."],
      mandatoryMultipleRules: [v => (!!v && !!v.length) || "Dies ist ein Pflichtfeld."],
      emailRules: [v => /\S+@\S+\.\S{2,}/.test(v) || !v || "Diese E-Mail ist ungültig!"],
      telRules: [
        v =>
          /^\+?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g.test(v) ||
          !v ||
          "Diese Telefonnummer ist ungültig!"
      ],
      urlRules: [v => /\S+\.\S{2,}/.test(v) || !v || "Die URL ist ungültig!"],
      isSending: false,
      dialog: false,
      alertType: "",
      alertMessage: ""
    };
  },

  methods: {
    async getEventBySlug(slug) {
      if (this.type !== "event") {
        return;
      }
      const [year, month] = this.shared.splitDate(this.date, true);
      if ([year, month].includes(NaN)) {
        return;
      }
      const eventFetched = this.$store.getters.getFetchedEventBySlug(slug, year, month);
      if (eventFetched[0]) {
        // Already fetched
        this.event = eventFetched[1];
      } else {
        // Not fetched yet
        this.event = await this.$store.dispatch("fetchEventBySlug", slug).catch(error => {
          console.error(error);
        });
      }
      this.forms = this.formatFormData(this.event.formData);
      this.formId = this.event.formId;
    },
    formatFormData(str) {
      const arr = [];
      // Split at the closing ] tag
      const rawForms = str.split(/]/g);
      for (let rawForm of rawForms) {
        const obj = {
          label: "",
          precedingText: "",
          type: "",
          mandatory: false,
          id: "",
          options: [],
          multiple: false,
          value: ""
        };
        // Split at the opening [ tag
        const splitForm = rawForm.split(/\[/g);
        if (splitForm.length === 2) {
          // First part is the label and the preceding text
          // Remove the closing </label> from the last form at the beginning of the string
          const rawLabel = splitForm[0].replace(/<\/label>/g, "").trim();
          const splitLabel = rawLabel.split(/(?=<label>)/g);
          for (let label of splitLabel) {
            if (label) {
              // Remove multiple spaces with a single space
              label = label.replace(/\s\s+/g, " ");
              if (label.includes("<label>")) {
                label = label.replace(/<label>/g, "");
                obj.label = label;
              } else {
                obj.precedingText = label;
              }
            }
          }
          // Second part are the options
          const rawOptions = splitForm[1].trim();
          // Match a whitespace followed by a quotation mark
          const splitOptions = rawOptions.split(/\s(?=["'])+/g);
          let preselect;
          for (let option of splitOptions) {
            if (option) {
              let parsingComplete = false;
              let isSucceedingOption = false;
              if (option.includes('"') || option.includes("'")) {
                // Match a quotation mark followed by a whitespace
                const succeedingSplitOptions = option.split(/["'](?=\s)+/g);
                // Option for select or radio
                obj.options.push(succeedingSplitOptions[0].replace(/["']+/g, "").trim());
                if (succeedingSplitOptions.length > 1) {
                  // Settings that are following a select option
                  option = succeedingSplitOptions[1].trim();
                  isSucceedingOption = true;
                } else {
                  parsingComplete = true;
                }
              }
              if (!parsingComplete) {
                // Settings like type, mandatory, default value
                const rawSettings = option.split(" ");
                if (rawSettings.length > 1 && !isSucceedingOption) {
                  if (rawSettings[0].includes("*")) {
                    obj.mandatory = true;
                    rawSettings[0] = rawSettings[0].replace(/\*/g, "");
                  }
                  obj.type = rawSettings[0].trim();
                  obj.id = rawSettings[1];
                }
                if (option.includes("multiple") || obj.type === "checkbox") {
                  obj.multiple = true;
                  obj.value = [];
                }
                if (option.includes("default")) {
                  // Save the default value and set it as obj.value after the loop
                  preselect = parseInt(option.slice(-1));
                }
              }
            }
          }
          obj.value = obj.options[preselect - 1];
          arr.push(obj);
        }
      }
      return arr;
    },
    addFormRule(form) {
      let arr = [];
      if (form.mandatory) {
        if (form.multiple) {
          arr = arr.concat(this.mandatoryMultipleRules);
        } else {
          arr = arr.concat(this.mandatoryRules);
        }
      }
      if (Array.isArray(this[`${form.type}Rules`])) {
        arr = arr.concat(this[`${form.type}Rules`]);
      }
      return arr;
    },
    async sendForm() {
      this.isSending = true;
      const data = {};
      for (const form of this.forms) {
        if (form.value && form.value.length > 0) {
          if (form.type === "url" && !form.value.includes("http")) {
            form.value = `https://${form.value}`;
          }
          data[form.id] = form.value.trim();
        }
      }
      try {
        // Create token for reCAPTCHA
        const token = await this.$recaptcha("login");
        await api.postData(data, token, this.formId).then(response => {
          this.alertType = "success";
          this.alertMessage = response;
        });
      } catch (error) {
        this.alertType = "error";
        this.alertMessage =
          error?.data?.message ||
          error ||
          "reCAPTCHA-Prüfung war nicht erfolgreich. Bitte versuchen Sie es noch einmal.";
      } finally {
        this.isSending = false;
        this.dialog = true;
      }
    },
    closeDialog() {
      this.dialog = false;
    },
    addProps() {
      if (this.formIdProp) {
        this.formId = this.formIdProp;
      }
      if (this.formDataProp) {
        this.forms = this.formatFormData(this.formDataProp);
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  computed: {
    isLoading() {
      if (this.type === "event") {
        return this.$store.state.eventsLoading;
      } else {
        return false;
      }
    },
    loadingError() {
      if (this.type === "event") {
        return this.$store.state.eventsLoadingError;
      } else {
        return false;
      }
    }
  },

  watch: {
    $route() {
      this.getEventBySlug(this.slug);
      this.addProps();
    }
  },

  created() {
    this.getEventBySlug(this.slug);
  },

  mounted() {
    this.addProps();
  }
};
</script>

<style></style>
