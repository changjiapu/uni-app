<template>
	<view>
		<!-- 首页 -->
		<home v-if="current_page === 'home'" :data="home_data"></home>
		<Cart v-if="current_page === 'cart'" ></Cart>
		<user-center v-if="current_page === 'user_center'" :data="user_center" ></user-center>
		<Classify v-if="current_page === 'classify'"></Classify>
		<tab-bar :data='app_nav' @currentPageChange='currentPageChange'></tab-bar>
	</view>
</template>

<script>
	import { prolist } from '@/common/api'
	import { mapState } from 'vuex'
	import Home from '../../components/home/home.vue'
	import Cart from '../../components/cart/cart.vue'
	import UserCenter from '../../components/user_center/user_center.vue'
	import Classify from '../../components/classify/classify.vue'
	import TabBar from '../../components/tabBar'
	export default {
		name: "index",
		components: {
			Home,
			TabBar,
			Cart,
			UserCenter,
			Classify
		},
		data() {
			return {
				home_data: [],
				app_nav: {},
				user_center: {},
				cart:[],
				current_page: 'home'
			}
		},
		onLoad(options) {
			//#ifdef MP-WEIXIN
			if(!this.userInfo.id){
					uni.navigateTo({
						url:'/pages/login/getUserInfo'
					})
				}
			// #endif
			if (options.current_page) {
				this.current_page = options.current_page
			}
			this.getProlist()
		},
	
		methods: {
			getProlist() {
				const use_appid = this.appid
				prolist({ use_appid }).then(res => {
					for (let idx of res.data) {
						if (idx.differ === '0') {
							this.home_data = JSON.parse(idx.content)
						}
						if (idx.differ === '2') {
							this.app_nav = JSON.parse(idx.content)[0]
						}
						if (idx.differ === '3') {
							this.user_center = JSON.parse(idx.content)[0]
						}
					}
				})
			},
			// 底部导航栏切换
			currentPageChange(e) {
				this.current_page = e.page_key
				if (e.page_key != 'home') {
					uni.setNavigationBarTitle({
						title: e.text,
					});
				} else {
					uni.setNavigationBarTitle({
						title: e.text,
					});
				}
				if (e.page_key == "classify") {
					uni.setNavigationBarColor({
						frontColor: '#000000',
						backgroundColor: "#ffffff"
					});
				} else {
					uni.setNavigationBarColor({
						frontColor: this.app_nav.top_color,
						backgroundColor: this.app_nav.top_background
					});
				}
			}
		},
		computed: {
			...mapState([
				'dianpuleibie',
				'userInfo'
			])
		}
	}
</script>

<style>

</style>
