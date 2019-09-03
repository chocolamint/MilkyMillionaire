import 'babel-polyfill';
import Vue from 'vue';
import AppComponent from './components/App.vue';

new Vue({
  el: '#app',
  render: h => h(AppComponent)
});