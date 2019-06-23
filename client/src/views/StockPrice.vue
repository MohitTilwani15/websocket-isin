<template>
  <v-container>
    <h1 :class="$style.heading">Live ISIN Price Updates</h1>
    <v-form @submit.prevent="subscribeToIsin(isin)">
      <v-layout row wrap>
        <v-flex xs6>
          <v-text-field
            label="Enter ISIN"
            :value="isin"
            @input="onInput"
          />
        </v-flex>
        <v-flex xs6>
          <v-btn type="submit" color="primary">ADD</v-btn>
        </v-flex>
      </v-layout>
    </v-form>
    
    <v-form @submit.prevent="subscribeToIsin(dropDownIsin)">
      <v-layout row wrap>
        <v-flex xs6>
          <v-select
            :items="defaultIsinOptions"
            label="Select ISIN"
            v-model="dropDownIsin"
          />
        </v-flex>
      <v-flex xs6>
        <v-btn type="submit" color="primary">ADD</v-btn>
      </v-flex>
    </v-layout>
    </v-form>

    <v-list v-if="Object.values(data).length">
      <v-list-tile>
        <v-list-tile-content><strong>ISIN</strong></v-list-tile-content>
        <v-list-tile-content><strong>PRICE</strong></v-list-tile-content>
        <v-list-tile-content class="align-end" />
      </v-list-tile>
      <v-divider />
      <template v-for="(item, idx) in data">
        <v-list-tile>
          <v-list-tile-content>{{ item.isin }}</v-list-tile-content>
          <v-list-tile-content>{{ item.price }}</v-list-tile-content>
          <v-list-tile-content class="align-end">
            <v-chip close @click="unSubscribeToIsin(item.isin)">Remove</v-chip>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider />
      </template>
    </v-list>
  </v-container>
</template>
<script lang="ts">
export default {
  name: 'stockPrice',

  data(): any {
    return {
      isin: '',
      dropDownIsin: '',
      webSocketConnections: {},
      data: {},
    };
  },

  beforeDestroy() {
    this.closeAllConnections();
  },

  computed: {
    defaultIsinOptions(): String[]  {
      return ['DE0005545503', 'DE0005118806', 'DE000A0HL8N9', 'US88579Y1010', 'DE0005167902'];
    },
  },

  methods: {
    onInput(isin: string): void {
      this.isin = isin;
    },

    subscribeToIsin(isin: string): boolean | void {
      if (this.data[isin] || !isin) {
        this.$toasted.show("Already added in list", { 
          theme: "toasted-primary", 
          position: "top-right", 
          duration : 5000
        });

        return false;
      }

      const ws = new WebSocket('ws://159.89.15.214:8080/');
      ws.onopen = () => ws.send(`{"subscribe": "${isin}"}`);
      ws.onmessage = (event) => {
        this.data = Object.assign({}, this.data, { [isin]: JSON.parse(event.data) });
      };
      ws.onerror = () => ws.close();
      ws.onclose = () => {
        setTimeout(() => {
          this.addSocketConnection();
        }, 1000);
      };

      this.webSocketConnections[isin] = ws;
    },

    unSubscribeToIsin(isin: string): void {
      const ws = this.webSocketConnections[isin];
      ws.send(`{"unsubscribe": "${isin}"}`);

      this.$nextTick(() => {
        this.$delete(this.data, isin);
      });
    },

    closeAllConnections(): void {
      for (let i in this.WebSocketConnections) {
        if (this.WebSocketConnections.hasOwnProperty(i)) {
          this.WebSocketConnections[i].close();
        }
      }
    },
  },
};
</script>
<style lang="scss" module>
.heading {
  margin-bottom: 4rem;
  color: rgba(0, 0, 0, .54);
}
</style>
