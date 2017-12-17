import Vue from 'vue';
import App from './components/App.vue';
import Card from "./components/Card.vue";
import Player from "./components/Player.vue";

Vue.component('card', Card);
Vue.component('player', Player);

new Vue({
  el: '#app',
  render: h => h(App)
});