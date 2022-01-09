import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import Vuelidate from 'vuelidate'
import _ from 'lodash';

const range = _.range(1, 3); // [1, 2]
const random = _.random(0, 5); // an integer between 0 and 5
Vue.use(Vuelidate)
Vue.use(VueMaterial)


Vue.config.productionTip = false
Vue.config.errorHandler = (err, vm, info) => {
  if (process.env.NODE_ENV !== 'production') {
    // Show any error but this one
    if (err.message !== "Cannot read properties of undefined (reading 'badInput')") {
      console.error(err);
    }
  }
};
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
