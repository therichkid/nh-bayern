<template>
  <v-row align="center" class="text-center" :style="{ height: height + 'px' }">
    <v-col>
      <v-progress-circular
        indeterminate
        :size="50"
        :width="5"
        color="primary"
      ></v-progress-circular>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    height: Number
  }
};
</script>

<style></style>
