import Vue from 'vue';
import App from './components/App.vue';
import Card from "./components/Card.vue";
import Player from "./components/Player.vue";
import Computer from "./components/Computer.vue";

Vue.component('card', Card);
Vue.component('player', Player);
Vue.component('computer', Computer);

new Vue({
  el: '#app',
  render: h => h(App)
});