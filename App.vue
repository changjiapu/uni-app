<script>
	import { baseURL } from '@/common/utils/config'
	export default {
		onLaunch: function () {
			// #ifdef APP-PLUS
			this.update()
			// #endif
			const userInfo = uni.getStorageSync('userInfo')
			if (userInfo) this.$store.commit('SET_USERINFO', userInfo)
			// #ifndef MP-WEIXIN
				this.getInfo()
			// #endif
			// #ifdef MP-WEIXIN
				this.$store.dispatch('getShopId', this.appid)
			// #endif
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
			},
			update () {
				let server = `${baseURL}/smallroutine/program/updataver`
				let req = {
					appid: plus.runtime.appid,
					version: plus.runtime.version
				}
				console.log(JSON.stringify(req))
				uni.request({
					url: server,
					data: req,
					method: 'post',
					success: res => {
						console.log(JSON.stringify(res))
						if (res.statusCode === 200 && res.data.rsp.status === 1) {
							uni.showModal({
								title: "更新提示",
								content: res.data.rsp.note,
								confirmText: '更新',
								success: rst => {
									if (rst.confirm) {
										uni.downloadFile({
											url:  res.data.rsp.url,
											success: files => {
												if (files.statusCode === 200) {
													plus.runtime.openFile(files.tempFilePath, {}, () => {
														uni.showToast({
															title: '安装失败',
															icon: 'none'
														})
													})
												}
											},
											fail: err => {
												plus.nativeUI.alert('下载更新文件失败')
											}
										})
									}
								}
							})
						}
					}
				})
			}
		},
		data () {
			return {
				baseURL: baseURL
			}
		}
	}
</script>

<style lang="less">
	@import './common/css/uni.css';
	uni-page-body, page {
		background-color: #f6f6f6;
		font-size: 30upx;
		width: 100%;
	}
	img,image{
		
	}
</style>
