import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './ZIMKit/src/plugin/i18n';
Vue.config.productionTip = false;

new Vue({
  i18n,
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
