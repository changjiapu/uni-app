<template>
	<view class='pay-order'>
		<view class="tiele">
			<view>
				<text class="suppspanl">订单需付金额</text>
				<text class="suppspanr">{{total_price||post_data.totalprice}}元</text>
			</view>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<form :report-submit="true" @submit="PayWay" class="popup-memu">
			<view class="line" style="background-color: rgb(255, 255, 255)"></view>
			<button :disabled="isDisabled" class="payMode" form-type='submit' v-for="(item,index) in pay_type" :key="index" :id='item.id'>
				<image v-if="item.id==1" :src="baseURL+'/weixinpl/shopping-temp/images/vip.png'"></image>
				<image v-if="item.id==2" :src="baseURL+'/weixinpl/shopping-temp/images/shop-gold.png'"></image>
				<image v-if="item.id==3" :src="baseURL+'/weixinpl/shopping-temp/images/payPacket.png'"></image>
				<image v-if="item.id==4" :src="baseURL+'/weixinpl/shopping-temp/images/wechat.png'"></image>
				<image v-if="item.id==5" :src="baseURL+'/weixinpl/shopping-temp/images/apply.png'"></image>
				<image v-if="item.id==15" :src="baseURL+'/weixinpl/shopping-temp/images/property.png'"></image>
				<image v-if="item.id==16" :src="baseURL+'/weixinpl/shopping-temp/images/money.png'"></image>
				<text style="width:70%; color:#777">{{item.name}}</text>
				<text>></text>
			</button>
		</form>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<form :report-submit="true" class="popup-memu">
			<view class="line" style="background-color: rgb(255, 255, 255)"></view>
			<button :disabled="isDisabled" class="payMode" form-type='submit' v-for="(item,index) in pay_type" :key="index"
			 @click=PayWay(item)>
				<image v-if="item.id==1" :src="baseURL+'/weixinpl/shopping-temp/images/vip.png'"></image>
				<image v-if="item.id==2" :src="baseURL+'/weixinpl/shopping-temp/images/shop-gold.png'"></image>
				<image v-if="item.id==3" :src="baseURL+'/weixinpl/shopping-temp/images/payPacket.png'"></image>
				<image v-if="item.id==4" :src="baseURL+'/weixinpl/shopping-temp/images/wechat.png'"></image>
				<image v-if="item.id==5" :src="baseURL+'/weixinpl/shopping-temp/images/apply.png'"></image>
				<image v-if="item.id==15" :src="baseURL+'/weixinpl/shopping-temp/images/property.png'"></image>
				<image v-if="item.id==16" :src="baseURL+'/weixinpl/shopping-temp/images/money.png'"></image>
				<text style="width:70%; color:#777">{{item.name}}</text>
				<text>></text>
			</button>
		</form>
		<!-- #endif -->
		<view class="action-sheet " v-if="passwordInputHidden">
			<view class="container">
				<view class='password-input'>
					<view>
						<text :style="{display:inputPassword[0]?'':'none'}"></text>
					</view>
					<view>
						<text :style="{display:inputPassword[1]?'':'none'}"></text>
					</view>
					<view>
						<text :style="{display:inputPassword[2]?'':'none'}"></text>
					</view>
					<view>
						<text :style="{display:inputPassword[3]?'':'none'}"></text>
					</view>
					<view>
						<text :style="{display:inputPassword[4]?'':'none'}"></text>
					</view>
					<view>
						<text :style="{display:inputPassword[5]?'':'none'}"></text>
					</view>
				</view>
				<view class='keyboard'>
					<view class='left number'>
						<view hover-class='active' :hover-stay-time=100 @click='InputPassword(1)'>1</view>
						<view hover-class='active' :hover-stay-time=100 @click='InputPassword(2)'>2</view>
						<view hover-class='active' :hover-stay-time=100 @click='InputPassword(3)'>3</view>
						<view hover-class='active' :hover-stay-time=100 @click='InputPassword(4)'>4</view>
						<view hover-class='active' :hover-stay-time=100 @click='InputPassword(5)'>5</view>
						<view hover-class='active' :hover-stay-time=100 @click='InputPassword(6)'>6</view>
						<view hover-class='active' :hover-stay-time=100 @click='InputPassword(7)'>7</view>
						<view hover-class='active' :hover-stay-time=100 @click='InputPassword(8)'>8</view>
						<view hover-class='active' :hover-stay-time=100 @click='InputPassword(9)'>9</view>
						<view hover-class='active' :hover-stay-time=100 @click='InputPassword(X)'>X</view>
						<view hover-class='active' :hover-stay-time=100 @click='InputPassword(0)'>0</view>
						<view hover-class='active' :hover-stay-time=100 @click='InputPassword'>.</view>
					</view>
					<view class='right ctr-btn'>
						<view class='ctr-btn-item' hover-class='active' :hover-stay-time='100' @click='clear'>

						</view>
						<view class='ctr-btn-item' hover-class='active' :hover-stay-time='100' @click='InputHidden'>取消</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		payList,
		paySet,
		productVirtual,
		personalPay
	} from '@/common/api/index.js'
	import {
		packagePay
	} from '@/common/api/packageA.js'
	import {
		mapState
	} from 'vuex'
	import { baseURL } from '@/common/utils/config'
	export default {
		data() {
			return {
				baseURL: baseURL,
				inputPassword: '', //输入密码
				passwordInputHidden: false,
				batchcode: '',
				post_data: '',
				pay_type: '',
				total_price: '',
				sendData: {},
				password: '',
				c: true,
				isDisabled: false,
				isPackage: false
			};
		},
		onLoad(options) {
			console.log(options)
			if (options.offsetprice) {
				//购物币优惠
				var offsetprice = JSON.parse(options.offsetprice)
			}
			if (options.isPackage) {
				this.isPackage = options.isPackage
			}
			var post_data = JSON.parse(options.post_data)
			this.batchcode = options.batchcode,
				this.offsetprice = offsetprice,
				this.post_data = post_data,
				this.total_price = options.total_price
			if (options.pay_type == 1) {
				var sendData = {
					pid: post_data[0].pid,
				}
			} else {
				var sendData = {}
			}
			payList(sendData).then(res => {
				this.pay_type = res.data.data
			})
		},
		onShow() {
			//获取支付密码
			paySet({
				user_id: this.userInfo.id
			}).then(res => {
				if (res.data.code) {
					this.password = res.data.mge
				} else {
					uni.showModal({
						title: '提示',
						content: '您还没有设置支付密码',
						confirmText: '去设置',
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/setPassword/setPassword',
								})
							}
						}
					})
				}
			})

		},
		methods: {
			PayWay(e) {
				console.log(e)
				this.isDisabled = true
				// #ifdef MP-WEIXIN
				var pay_id = e.detail.target.id,
					formId = e.detail.formId
				// #endif
				// #ifndef MP-WEIXIN
				var pay_id = e.id,
					formId = ''
				// #endif
				var sendData = {
					appid: this.appid,
					user_id: this.userInfo.id,
					formId: formId || '',
					batchcode: this.batchcode,
					password: this.password,
					pay_id: pay_id,
					total_price: this.total_price || this.post_data.totalprice,
				}
				if (pay_id == 4) { // 微信支付
					sendData.openid = this.userInfo.openid;
					this.sendData = sendData
					if (!this.isPackage) {
						this.createOrder(sendData);
					} else {
						this.createOrder2(sendData);
					}

				} else { //内部支付
					this.sendData = sendData
					this.InputHidden();
				}
			},
			InputHidden() {
				if (!this.password) {
					uni.showModal({
						title: '提示',
						content: '您还没有设置支付密码',
						confirmText: '去设置',
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/setPassword/setPassword',
								})
							}
						}
					})
					return
				}

				this.passwordInputHidden = !this.passwordInputHidden
				this.inputPassword = ''

			},
			InputPassword(e) {
				this.inputPassword = this.inputPassword + e
				if (this.inputPassword.length == 6 && this.password == this.inputPassword) {
					// 大礼包跳转不判断以下购物币优惠券内容
					if (!this.isPackage) {
						//当购物币免密支付开启并且
						if (this.offsetprice.is_nopassword == 1 && this.offsetprice.numprice > this.offsetprice.nopassword_max) {
							if (this.c) {
								uni.showModal({
									title: '提示',
									content: '请输入购物币密码',
									success: (type) => {
										if (type.confirm) {
											this.inputPassword = ''
											this.c = false
										}
									}
								})

							} else {
								this.createOrder();
							}
						} else {
							this.createOrder();
							this.InputHidden();
						}
					} else {
						this.createOrder2();
						this.InputHidden();
					}

				}
				if (this.inputPassword.length == 6 && this.password != this.inputPassword) {
					uni.showModal({
						title: '',
						content: '密码错误',
						success: (type) => {
							if (type.confirm) {
								this.inputPassword = ''
							}
						}
					})

				}
			},
			clear() {
				var index = this.inputPassword.length;
				if (index > 0) {
					this.inputPassword = this.inputPassword.substr(0, index - 1);

				}
			},
			createOrder() {
				uni.showLoading({
					title: '支付中',
					mask: true
				})
				var _this = this;
				var sendData = this.sendData;
				personalPay(sendData).then(res => {
					console.log(JSON.stringify(res))
					uni.hideLoading();
					if (res.data.code == 400000) {
						if (sendData.pay_id == 4) { //微信支付
							var state = res.data.msg;
							if (!res.data.status) {
								uni.showModal({
									title: '提示',
									content: state,
									showCancel: false
								})
								return
							}
							// #ifdef APP-PLUS
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: res.data.data, //订单数据
								success: (res) => {
									uni.redirectTo({
										url: '/pages/myOrder/index?tab=0',
									})
								},
								fail: function(err) {
									console.log('fail:' + JSON.stringify(err));
								}
							});
							// #endif
							// #ifdef MP-WEIXIN
							uni.requestPayment({
								'timeStamp': res.data.data.timeStamp,
								'nonceStr': res.data.data.nonceStr,
								'package': res.data.data.package,
								'signType': res.data.data.signType,
								'paySign': res.data.data.paySign,
								success: (res) => {
									uni.redirectTo({
										url: '/pages/myOrder/index?tab=0',
									})
								},
								fail: (res) => {}
							})
							// #endif

						} else { //内部支付
							uni.showToast({
								title: '支付成功',
								mask: true
							})
							let sendData = {
								batchcode: this.batchcode,
								user_id: this.userInfo.id
							}
							productVirtual(sendData).then(res => {})
							if (this.grouptype) {
								setTimeout(() => {
									uni.redirectTo({
										url: '/pages/my-collage_info?batchcode=' + this.batchcode,
									})
								}, 1500);
							} else {
								setTimeout(() => {
									uni.redirectTo({
										url: '/pages/myOrder/index?tab=0',
									})
								}, 1500);
							}

						}
					} else {
						uni.showModal({
							title: '提示',
							content: res.data.msg,
							showCancel: false
						})
					}
				})

			},
			// 大礼包支付
			createOrder2() {
				uni.showLoading({
					title: '支付中',
					mask: true
				})
				var _this = this;
				var sendData = this.sendData;
				packagePay(sendData).then(res => {
					console.log(JSON.stringify(res))
					uni.hideLoading();
					if (res.data.code == 0) {
						if (sendData.pay_id == 4) { //微信支付
				
							// #ifdef APP-PLUS
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: res.data.data, //订单数据
								success: (res) => {
									uni.redirectTo({
										url: '/pages/myOrder/index?tab=0',
									})
								},
								fail: function(err) {
									console.log('fail:' + JSON.stringify(err));
								}
							});
							// #endif
							// #ifdef MP-WEIXIN
							uni.requestPayment({
								'timeStamp': res.data.data.timeStamp,
								'nonceStr': res.data.data.nonceStr,
								'package': res.data.data.package,
								'signType': res.data.data.signType,
								'paySign': res.data.data.paySign,
								success: (res) => {
									uni.redirectTo({
										url: '/pages/myOrder/index?tab=0',
									})
								},
								fail: (res) => {}
							})
							// #endif

						} else { //内部支付
							uni.showToast({
								title: '支付成功',
								mask: true
							})
							let sendData = {
								batchcode: this.batchcode,
								// customer_id: app.globalData.userInfo.customer_id,
							}
							productVirtual(sendData).then(res => {})
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/myOrder/index?tab=0',
								})
							}, 1500);
						}
					} else {
						uni.showModal({
							title: '提示',
							content: res.data.data,
							showCancel: false
						})
					}
				})
			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		}
	}
</script>

<style lang="less">
	@import '../../common/css/variables.less';
	.tiele {
		font-size: 16px;
		text-align: center;
		padding: 8px 0 0 0;
		height: 40px;
	}

	.suppspanl {
		float: left;
		padding-left: 15px;
		font-size: 18px;
		color: #707070;
		line-height: 34px;
	}

	.suppspanr {
		float: right;
		padding-right: 15px;
		font-size: 16px;
		color: red;
		line-height: 34px;
	}

	.popup-memu {
		width: 100%;
		background-color: white;
		border-top: 1px solid #DEDBD5;
		border-bottom: 1px solid #eee;
		display: block;
	}

	.line {
		background-color: #eee;
		margin-left: 10px;
		height: 1px;
		margin-right: 10px;
	}

	.popup-memu {
		height: 50px;
		font-size: 15px;
		line-height: 50px;
		border-bottom: 1px solid #eee;
	}

	.payMode {
		display: flex;
		background: #ffffff;
		align-items: center;
		border-bottom: 2px solid #eee;
	}

	.payMode image {
		width: 30px;
		height: 30px;
		margin-left: 18px;
		margin-right: 10px;
	}

	.sheet-content {
		background-color: #fff;
		padding: 0 15rpx;
	}

	.action-sheet {
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
		height: 100%;
		width: 100%;
		z-index: 99;
	}

	.container {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 100;
		background-color: #fff;
	}

	.password-input {
		display: flex;
		width: 660rpx;
		border: 1px solid #ddd;
		margin: 0 auto;
		margin-top: 50rpx;
		background-color: #fff;
		border-radius: 3px;
	}

	.password-input view {
		width: 110rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		border-right: 1px solid #ccc;
	}

	.password-input view:nth-child(6) {
		border-right: none;
	}

	.password-input view text {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: #333;
	}

	.tips {
		font-size: 28rpx;
		text-align: center;
		margin-top: 5px;
	}

	.tips text {
		color: #c30;
	}

	.keyboard {
		width: 100%;
		display: flex;
		background-color: #fff;
		border-top: 1px solid #eee;
		margin-top: 50rpx;
	}

	.keyboard .number {
		display: flex;
		width: 570rpx;
		flex-wrap: wrap;
	}

	.keyboard .number view {
		width: 190rpx;
		height: 120rpx;
		line-height: 120rpx;
		text-align: center;
		font-size: 46rpx;
		font-weight: bold;
		box-sizing: border-box;
		border-right: 1px solid #eee;
		border-bottom: 1px solid #eee;
	}

	.keyboard .ctr-btn {
		width: 180rpx;
	}

	.keyboard .ctr-btn view {
		height: 240rpx;
		line-height: 240rpx;
		text-align: center;
		box-sizing: border-box;
		border-bottom: 1px solid #eee;
	}

	.keyboard .ctr-btn view:nth-child(1) {
		background-repeat: no-repeat;
		background-position: center center;
		background-size: 50upx 50upx;
		background-image: url("@{URL}/weixinpl/shopping-temp/images/backspace.svg");
	}

	.keyboard .ctr-btn view:nth-child(2) {
		font-size: 46rpx;
		color: #c30;
	}

	.keyboard .active {
		background-color: #e4e7ed;
	}

	.activity {
		background-color: #fff;
		padding: 25rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 24rpx;
		border-bottom: 1px solid #f6f6f6;
	}

	.activity.activity-item {
		font-size: 26rpx
	}

	.arrows-right {
		width: 30rpx;
		height: 30rpx;
	}

	.arrows-right.active {
		transform: rotate(270deg);
	}
</style>
