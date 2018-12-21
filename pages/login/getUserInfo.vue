<template>
	<view class="container">
		<view class="login-icon">
			<image :src="baseURL+'/weixinpl/shopping-temp/images/xiaochengxu.png'"></image>
		</view>
		<view class="loginBtnView">
			<text>申请获取以下权限</text>
			<text>获取你的公开信息(昵称.头像等)</text>
			<button v-if="isShow" class="loginBtn" @getuserinfo='getUserInfo' open-type='getUserInfo'>授权登录</button>
			<button v-else class="loginBtn2">授权中</button>
		</view>
	</view>
</template>

<script>
	import { baseURL } from '@/common/utils/config'
	export default {
		data() {
			return {
				baseURL: baseURL,
				code: '',
				parent_id: '',
				weixin_name: '',
				isShow: true,
				userInfo: {},
				appid: 'wxd3451cfb485bad19'
			};
		},
		onLoad() {

		},
		methods: {
			getUserInfo(res) {
				this.isShow = false
				// 获取code登录态 并通过调用getUserSessionKey 获取用户的openid session_key
				uni.login({
					success: (data) => {
						this.userInfo = res.detail.userInfo;
						this.userInfo.iv = res.detail.iv;
						this.userInfo.encryptedData = res.detail.encryptedData;
						this.userInfo.signature = res.detail.signature;
						this.userInfo.code = data.code;;
						this.userInfo.parent_id = '';
						this.userInfo.appid = this.appid
						this.getUserSessionKey(this.userInfo);
					}
				});

			},
			getUserSessionKey: function(userinfo) {
				//用户的订单状态
				var that = this;
				uni.request({
					url: that.baseURL + '/api/Login/getsessionkey',
					method: 'post',
					data: userinfo,
					dataType: 'json',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'cookie': 'XDEBUG_SESSION=PHPSTORM'
					},
					success: function(res) {
						var data = res.data;
						if (data.status == 0) {
							uni.showToast({
								title: data.err,
								duration: 2000
							});
							return false;
						}
						that.userInfo['sessionId'] = data.session_key;
						that.userInfo['openid'] = data.openid;
						that.userInfo['unionid'] = data.unionid;
						that.onLoginUser();
					},
					fail: function(e) {
						uni.showToast({
							title: '网络异常！getsessionkeys',
							duration: 2000
						});
					},
				});
			},
			onLoginUser: function() {
				var that = this;
				var user = this.userInfo;
				wx.request({
					url: that.baseURL + '/api/Login/authlogin',
					method: 'post',
					data: user,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: function(res) {
						var data = res.data;
						var status = res.data.status;
						if (status == 0) {
							uni.showToast({
								title: res.data.err,
								duration: 3000
							});
							return false;
						}
						that.userInfo['id'] = data.id;
						that.userInfo['uname'] = data.weixin_unionid;
						that.userInfo['ticket'] = data.ticket;
						that.userInfo['customer_id'] = data.customer_id;
						that.userInfo['dianpuleibie'] = that.$store.dianpuleibie

						var userId = data.id;
						if (!userId) {
							uni.showToast({
								title: '登录失败！',
								duration: 3000
							});
							return false;
						}
						uni.setStorageSync('userInfo', that.userInfo);
						that.$store.commit('SET_USERINFO', that.userInfo)
						that.$store.dispatch('getShopId')
						uni.reLaunch({
							url: '/pages/index/index',
						})
					},
					fail: function(e) {
						uni.showToast({
							title: '网络异常！authlogin',
							duration: 2000
						});
					},
				});
			},

		}

	}
</script>

<style lang="less" scoped>
	uni-page-body, page  {
		background-color: #fff;
	}

	.container {
		display: flex;
		flex-direction: column;

		.login-icon {
			padding: 60rpx 220rpx;
			border-bottom: 1px solid #f2f2f2;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				height: 180rpx;
				width: 180rpx;
			}

		}

		.loginBtnView {
			margin-top: 50rpx;
			display: flex;
			flex-direction: column;

			text {
				margin-left: 50upx;
			}

			text:nth-child(1) {
				font-size: 20px;
				margin-bottom: 50rpx;
			}

			text:nth-child(2) {
				font-size: 14px;
				color: #666;
			}

		}

		.loginBtn {
			margin-top: 50rpx;
			background-color: #00b258;
			color: #fff;
			width: 650rpx;
			border-radius: 50rpx;
		}

		.loginBtn2 {
			margin-top: 50rpx;
			background-color: #666;
			color: #fff;
			width: 650rpx;
			border-radius: 50rpx;
		}
	}
</style>
