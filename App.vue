<script>
	export default {
		onLaunch: function () {
			const userInfo = uni.getStorageSync('userInfo')
			if (userInfo) this.$store.commit('SET_USERINFO', userInfo)
			// #ifndef MP-WEIXIN
				this.getInfo()
			// #endif
			// #ifdef MP-WEIXIN
				this.$store.dispatch('getShopId', this.appid)
			// #endif
			//console.log('App Launch')
		},
		onShow: function () {
			//console.log('App Show')
		},
		onHide: function () {
			//console.log('App Hide')
		},
		methods: {
			getInfo () {
				this.$store.dispatch("getAppid", this.appid).then(res => {
					if (res) this.$store.dispatch('getShopId', this.appid)
				})
			}
		}
	}
</script>

<style>
	@import './common/css/uni.css';
	uni-page-body, page {
		background-color: #f6f6f6;
		font-size: 30upx;
		width: 100%;
	}
	img,image{
		
	}
</style>
