import Vue from 'vue';
import App from './components/App.vue';
import Card from "./components/Card.vue";

Vue.component('card', Card);

new Vue({
  el: '#app',
  render: h => h(App)
});