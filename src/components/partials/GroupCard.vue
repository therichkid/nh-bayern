<template>
  <v-card
    hover
    :to="`/netzwerk/${group.slug}`"
    class="d-flex flex-column"
    :style="{
      'border-top': `6px solid ${group.color || 'var(--v-primary-base)'}`
    }"
  >
    <v-img
      :src="group.featuredImage.source"
      :alt="group.featuredImage.title"
      max-height="250"
      style="border-radius: 0"
    >
    </v-img>
    <v-chip-group column class="px-3">
      <v-chip
        :color="group.color || 'primary'"
        text-color="white"
        v-for="category in group.categories"
        :key="category.name"
        small
      >
        {{ category.name }}
      </v-chip>
    </v-chip-group>
    <v-card-title class="pt-0">
      <h3 class="subtitle-2" style="word-wrap: break-word; hyphens: auto">
        {{ group.name }}
      </h3>
    </v-card-title>
    <v-spacer></v-spacer>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-icon>mdi-chevron-right</v-icon>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    group: Object
  }
};
</script>

<style></style>
