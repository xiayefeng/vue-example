// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import './style/element-variables.scss'

import regDirective from './directive/index'
import regComponent from './directive/regComponent'

import {isProd} from './api/util' // 是否生产环境

Vue.config.productionTip = false
if (isProd) {
  Vue.config.devtools = false
  Vue.config.silent = true
}

regDirective()
regComponent()

Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
  // 只在 2.2.0+ 可用
  console.log(err)
  console.log(info)
}

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
