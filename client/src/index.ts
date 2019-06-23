import Vue from 'vue';
import Vuetify from 'vuetify';
import Toasted from 'vue-toasted';
import App from './App.vue';

Vue.use(Vuetify);
Vue.use(Toasted);

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
});
