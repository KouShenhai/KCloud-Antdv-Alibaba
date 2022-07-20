// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import permission from './directive/permission'
import style from './directive/style'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@/components/ProLayout'
import FooterToolBar from '@/components/FooterToolbar'
import FileUpload from '@/components/FileUpload'
import themePluginConfig from '../config/themePluginConfig'
import { TableSetting } from '@/components'

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree, tableSorter } from '@/utils/laokou'
import { download } from '@/utils/request'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 全局方法挂载
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.tableSorter = tableSorter
Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)
Vue.component('footer-tool-bar', FooterToolBar)
Vue.component('file-upload', FileUpload)
Vue.component('table-setting', TableSetting)

Vue.use(permission)
Vue.use(style)
Vue.use(mavonEditor)

window.umi_plugin_ant_themeVar = themePluginConfig.theme
new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
