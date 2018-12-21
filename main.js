import Vue from 'vue'
import App from './App'
import store from '@/common/store'
import GolbalMethod from'@/common/utils/index.js'
import EmptyData from '@/components/EmptyData'
import { appid } from '@/common/utils/config'

Vue.component('empty-data', EmptyData)
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$gotoLogin=GolbalMethod.gotoLogin
Vue.prototype.$store = store
Vue.prototype.$LinkTo = GolbalMethod.LinkTo
Vue.prototype.appid = appid

const app = new Vue({
	store,
    ...App
})
app.$mount()
