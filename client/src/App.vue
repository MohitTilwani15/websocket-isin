<template>
  <v-app>
    <stock-price />
  </v-app>
</template>

<script lang="ts">
import StockPrice from './views/StockPrice.vue';

export default {
  name: 'app',

  components: {
    StockPrice,
  },
};
</script>
