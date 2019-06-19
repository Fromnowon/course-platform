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
Axios.defaults.withCredentials = true;
Vue.prototype.$axios = Axios
Vue.prototype.API = 'http://127.0.0.1:9001';

Vue.directive('hover', {
  bind: function (el, binding, vnode) {
    el.onmouseenter = function (e) {
      var classVal = el.children[2].getAttribute("class");
      classVal = classVal.concat(" " + binding.value);
      el.children[2].setAttribute("class", classVal);
      el.children[0].style.opacity = 1;
    }
    el.onmouseleave = function (e) {
      var classVal = el.children[2].getAttribute("class");
      classVal = classVal.replace(binding.value, "");
      el.children[2].setAttribute("class", classVal);
      el.children[0].style.opacity = 0;

    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')