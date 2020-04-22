<template>
  <v-row dense>
    <!-- Table -->
    <v-col cols="12" sm="5" md="4">
      <v-card>
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Nach Gruppen suchen"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                :items="facilityTypes"
                v-model="selectedFacilityType"
                label="Typ"
                clearable
                hide-details
                v-if="type === 'facilities'"
              ></v-select>
              <v-select
                :items="regions"
                v-model="selectedRegion"
                label="Regierungsbezirk"
                clearable
                hide-details
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <v-data-table
          :headers="table.headers"
          :items="filteredGroups"
          :items-per-page="$vuetify.breakpoint.xsOnly ? 5 : 10"
          :sort-by="table.sortBy"
          :loading="isLoading"
          :mobile-breakpoint="NaN"
          disable-filtering
          must-sort
          @click:row="setGroupToActive"
          style="cursor: pointer;"
        >
          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  right
                  :to="`/shgs/${item.slug}`"
                  v-on="on"
                  v-if="type === 'shgs'"
                  aria-label="Öffnen"
                >
                  <v-icon>mdi-open-in-app</v-icon>
                </v-btn>
                <v-btn
                  icon
                  right
                  :href="item.homepage"
                  target="_blank"
                  rel="noopener noreferrer"
                  v-on="on"
                  v-if="type === 'facilities' && item.homepage"
                  aria-label="Öffnen"
                >
                  <v-icon>mdi-open-in-app</v-icon>
                </v-btn>
              </template>
              <span>Seite öffnen</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card>
    </v-col>

    <!-- Map -->
    <v-col cols="12" sm="7" md="8">
      <div id="map">
        <l-map :zoom="zoom" :center="center">
          <l-tile-layer
            :url="tileProvider.url"
            :attribution="tileProvider.attribution"
          ></l-tile-layer>
          <l-geo-json :geojson="bavaria" :options="geojsonOptions" />
          <l-marker-cluster :options="{ maxClusterRadius: 15 }">
            <l-marker v-for="group in filteredGroups" :key="group.id" :lat-lng="group.latlng">
              <l-icon :icon-size="[40, 62]" :icon-anchor="[20, 62]" :popup-anchor="[0, -40]">
                <div :class="{ bounce: group === activeGroup }">
                  <img
                    src="../../assets/map/beratungsstelle.png"
                    :alt="group.type"
                    height="62px"
                    width="40px"
                    v-if="group.type === 'Beratungsstelle'"
                  />
                  <img
                    src="../../assets/map/klinik.png"
                    :alt="group.type"
                    height="62px"
                    width="40px"
                    v-else-if="group.type === 'Klinik'"
                  />
                  <img
                    src="../../assets/map/reha.png"
                    :alt="group.type"
                    height="62px"
                    width="40px"
                    v-else-if="group.type === 'Reha'"
                  />
                  <img
                    src="../../assets/map/shg.png"
                    :alt="group.type"
                    height="62px"
                    width="40px"
                    v-else
                  />
                </div>
              </l-icon>
              <MapPopup :group="group" :type="type" />
            </l-marker>
          </l-marker-cluster>
          <div v-if="allowGeolocation">
            <l-circle
              :lat-lng="currentLocation.center"
              :radius="currentLocation.radius"
              color="#ed1c24"
              :zIndexOffset="-100"
            />
            <l-marker :lat-lng="currentLocation.center" :zIndexOffset="-100">
              <l-icon :icon-size="[40, 62]" :icon-anchor="[20, 62]" :popup-anchor="[0, -40]">
                <img
                  src="../../assets/map/you_are_here.png"
                  alt="You are here"
                  height="62px"
                  width="40px"
                />
              </l-icon>
              <l-popup>
                <h3 class="headline">Ihr Standort!</h3>
              </l-popup>
            </l-marker>
          </div>
        </l-map>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import MapPopup from "@/components/partials/MapPopup";
import { LMap, LTileLayer, LGeoJson, LMarker, LIcon, LPopup, LCircle } from "vue2-leaflet";
import L from "leaflet";
import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";
import bavaria from "@/assets/map/bavaria.geo.json";

export default {
  components: {
    MapPopup,
    LMap,
    LTileLayer,
    LGeoJson,
    LMarker,
    LIcon,
    LPopup,
    LCircle,
    "l-marker-cluster": Vue2LeafletMarkerCluster
  },

  props: {
    groups: Array,
    type: String
  },

  data() {
    return {
      zoom: 7,
      center: [48.8, 11.0],
      bavaria,
      geojsonOptions: {
        color: "var(--v-primary-base)",
        opacity: 0.75,
        fillOpacity: 0.05,
        weight: 2
      },
      allowGeolocation: false,
      isCalculatingDistance: false,
      table: {
        headers: [
          { text: "Name", value: "name" },
          { text: "", value: "action", sortable: false, align: "right" }
        ],
        sortBy: "name"
      },
      search: null,
      facilityTypes: ["Klinik", "Reha", "Beratungsstelle"],
      selectedFacilityType: null,
      regions: [
        "Oberbayern",
        "Niederbayern",
        "Schwaben",
        "Oberfranken",
        "Mittelfranken",
        "Unterfranken",
        "Oberpfalz",
        "Thüringen"
      ],
      selectedRegion: null,
      activeGroup: null,
      timeout: null
    };
  },

  computed: {
    tileProvider() {
      if (this.$vuetify.theme.dark) {
        return {
          url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        };
      } else {
        return {
          url: "https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        };
      }
    },
    isLoading() {
      return this.type === "shgs"
        ? this.$store.state.groupsLoading
        : this.$store.state.facilitiesLoading;
    },
    filteredGroups() {
      const filteredGroups = [];
      for (const group of this.groups) {
        if (this.selectedFacilityType && group.type !== this.selectedFacilityType) {
          continue;
        }
        if (this.selectedRegion && group.region !== this.selectedRegion) {
          continue;
        }
        if (this.search && !group.name.toLowerCase().includes(this.search.toLowerCase())) {
          continue;
        }
        filteredGroups.push(group);
      }
      return filteredGroups;
    }
  },

  watch: {
    isLoading(isLoading) {
      if (!isLoading) {
        this.getCurrentLocation();
      }
    },
    selectedRegion(region) {
      this.$store.commit("changeRegion", region);
    }
  },

  methods: {
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          location => {
            this.currentLocation = {
              center: [location.coords.latitude, location.coords.longitude],
              radius: location.coords.accuracy / 2
            };
            this.addDistanceToGroups();
            this.table.headers.splice(1, 0, {
              text: "Distanz [km]",
              value: "distance"
            });
            this.allowGeolocation = true;
            this.center = this.currentLocation.center;
            this.zoom = 8;
            this.table.sortBy = "distance";
          },
          error => {
            console.error(error);
          }
        );
      }
    },
    addDistanceToGroups() {
      for (const group of this.groups) {
        const loc = this.currentLocation.center;
        group.distance = parseInt(L.latLng(loc[0], loc[1]).distanceTo(group.latlng) / 1000);
      }
    },
    setGroupToActive(group) {
      if (this.timeout) {
        this.timeout = null;
      }
      this.activeGroup = group;
      this.center = group.latlng;
      // Set the activeGroup to null after the bouncing animation
      // Else the icon would bounce again after each filter change
      this.timeout = setTimeout(() => {
        this.activeGroup = null;
      }, 2250);
    }
  },

  mounted() {
    if (!this.isLoading) {
      this.getCurrentLocation();
    }
    if (this.$store.state.region) {
      this.selectedRegion = this.$store.state.region;
    }
  }
};
</script>

<style>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

#map {
  height: 800px;
  width: 100%;
}
.vue2leaflet-map {
  z-index: 0;
}
@keyframes bounce {
  0% {
    transform: scale(1, 1) translate(0px, 0px);
  }
  30% {
    transform: scale(1, 0.8) translate(0px, 10px);
  }
  75% {
    transform: scale(1, 1.1) translate(0px, -25px);
  }
  100% {
    transform: scale(1, 1) translate(0px, 0px);
  }
}
.bounce {
  animation: bounce 0.75s 3;
}
</style>
