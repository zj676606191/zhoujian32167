// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import VueCookies from 'vue-cookies'
// mock, 这种本地mock有毒, 代理之后不转发cookie, 删除mock文件夹
// import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter

Vue.config.productionTip = false
// bootstrap 初始化的创建一些配置
// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
Vue.use(VueCookies)
new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
