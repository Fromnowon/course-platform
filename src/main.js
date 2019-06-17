import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import 'animate.css'
import Axios from 'axios'
import 'font-awesome/css/font-awesome.css'

Vue.use(Antd)
Vue.config.productionTip = false
Axios.defaults.withCredentials=true;
Vue.prototype.$axios = Axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')