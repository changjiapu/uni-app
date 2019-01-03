<template>
<view class="alertPay">
	<view class="statusbar" @tap="$emit('on-close')"></view>
	<view class="list">
	   <view class="title">支付方式</view>
		<!-- #ifndef MP-WEIXIN -->
		<view class="pay">
			<view @tap="toPay(item.id)" :class="['item', {default: item.id === 3, weixin: item.id === 4, apply: item.id === 5}]" v-for="(item, index) in payList" :key="index">
				{{ item.name }}
			</view>
		</view>
		<!-- #endif -->
	</view>
	<view class="model" v-if="keyShow">
		<view class="main">
			<view class='password-input'>
				<view v-for="(i, idx) in 6" :key="i"><view :class="{act: idx < password.length}"></view></view>
			</view>
			<!-- 键盘 -->
			<view class='keyboard'>
				<view class='left number'>
					<view v-for="(i, o) in key.code.length" :key="o">
						<view v-for="(m, idx) in key.code[o]" :key="idx" hover-class='active' :hover-stay-time='100' @click="InputPwd(m)">{{ m }}</view>
					</view>
				</view>
				<view class='right ctr-btn'>
					<view v-for="(c, idx) in key.control" :key="idx" class='ctr-btn-item' hover-class='active' :hover-stay-time='100' @click="control(c)">{{ c }}</view>
				</view>
			</view>
		</view>
	</view>
</view>
</template>

<script>
	import { paySet, payList, personalPay, productVirtual } from '@/common/api'
	import { packagePay } from '@/common/api/packageA'
	import { mapState } from 'vuex'
	export default {
		name: 'paylist',
		props: {
			detail: {
				type: Object,
				required: true
			},
			tag: {
				type: Number,
				required: true
			}
		},
		data() {
			return {
				params: {
					user_id: ''
				},
				password:'',
				originalPwd: '',
				payList: [],
				keyShow: false,
				key: {
					code: [[1,2,3],[4,5,6],[7,8,9],['x',0,'.',]],
					control: ['', '取消']
				},
				payParams: {},
				providerList: []
			}
		},
		created () {
			this.params.user_id = this.userInfo.id
			this.getPwd()
			this.getList()
		},
		methods: {
			toPay (pay_id) {
				this.payParams.pay_id = pay_id
				switch(pay_id) {
					case 3:
					this.keyShow = true
					break;
					case 4:
					const o_o = {
						appid: this.appid
					}
					this.PayWay(o_o)
					break;
					case 5:
					const apply = {
						appid: this.appid
					}
					this.PayWay(apply)
					break;					
				}
			},
			getPwd() {
				paySet(this.params).then(res => {
					if (res.data.code === 1) {
						this.originalPwd = res.data.mge
					} else if (res.data.code === 0) {
						uni.showModal({
							title: '',
							content: '你还没有设置支付密码',
							confirmText: '去设置',
							success: res => {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/setPassword/setPassword'
									})
								}
							}
						})
					}
				})
			},
			getList() {
				uni.showLoading()
				payList({ appid: this.appid }).then(res => {
					uni.hideLoading()
					console.log(res.data.length)
					if (!res.data.code) {
						this.payList = res.data.data
					}
				})
			},
			InputPwd(key) {
				if (this.password.length !== 6) this.password += key
				
			},
			control (event) {
				switch (event) {
					case '':
					this.password = this.password.substr(0, this.password.length - 1)
					break
					case '取消':
					this.keyShow = false
					break
				}
			},
			PayWay (o) {
				if (!o) this.o = {}
				this.payParams.batchcode = this.detail.batchcode
				this.payParams.total_price = this.detail.pay_money - this.detail.deductible_money
				this.payParams.password = this.originalPwd
				this.payParams.openid = this.userInfo.openid
				uni.showLoading({
					mask: true,
					title: '支付中'
				})
				let toPayWay
				this.tag === 1 ? toPayWay = personalPay : toPayWay = packagePay,
					toPayWay({...this.params, ...this.payParams, ...o}).then(res => {
						console.log(JSON.stringify(res))
						uni.hideLoading()
						if (this.payParams.pay_id === 3) {
							if (res.data.code === 400000 || !res.data.code) {
								productVirtual({ batchcode: this.detail.batchcode, ...this.params })
								uni.showModal({
									title: '',
									content: this.tag === 1 ? res.data.data.data : res.data.data,
									showCancel: false,
									success: res => {
										if (res.confirm) {
											uni.redirectTo({
												url: '/pages/myOrder/index'
											})
										}
									}
								})
							} else {
								uni.showModal({
									title: '',
									content: this.tag === 1 ? res.data.msg : res.data.data,
									showCancel: false
								})
							}
						} else if (this.payParams.pay_id === 4 || this.payParams.pay_id === 5) {
							 let provider
							 this.payParams.pay_id === 4 ? provider = 'wxpay' : provider = 'alipay'
							 if (res.data.status) {
								 uni.requestPayment({
									 provider: provider,
									 orderInfo: res.data.data,
								 	success: (res) => {
								 		uni.redirectTo({
								 			url: '/pages/myOrder/index',
								 		})
								 	},
								 	fail: err => {
										console.log(JSON.stringify(err))
								 	}
								 })
							 } else {
								 uni.showModal({
								 	title: '',
									content: res.data.data.return_msg,
									showCancel: false
								 })
							 }
						}
					})
			}
		},
		watch: {
			password: function(val, oldval) {
				if (val.length === 6) {
					if (this.password !== this.originalPwd) {
						uni.showModal({
							title: '',
							content: '密码错误',
							success: (type) => {
								if (type.confirm) {
									this.password = ''
								}
							}
						})
					} else {
						this.PayWay()
				   }
				}
			},
			keyShow: function(val, oldval) {
				if (!val) this.password = ''
			}
		},		
		computed: {
			...mapState([
				'userInfo'
			])
		},
	}
</script>

<style lang="less" scoped>
@import '../common/css/variables.less'; 	
.alertPay, .statusbar, .list {
	position: fixed;	
	left: 0;
	width: 100%;
}
.alertPay, .statusbar {
	top: 0;
	height: 100%;	
}
.alertPay {
	z-index: 66;
	.statusbar {
		z-index: 2;
		background-color:rgba(0,0,0,.4);
	}
	.list {
		z-index: 3;
		bottom: 0;
		background-color:white;
		font-size: 30upx;
		padding: 0;
		.title {
			text-align: center;
			height: 80upx;
			line-height: 80upx;
			font-size: 28upx;
		}
		.pay {
			box-sizing: border-box;
			border-top:1px solid #f1f1f1;
			padding: 0 15px;
			overflow: hidden;
			display: block;
			.item {
				padding: 25upx 0 25upx 50upx;
				position: relative;
				font-size: 24upx;
				background-repeat:no-repeat;
				background-size: 40upx 40upx;
				background-position: left center;
				background-color:white;
				text-align: left;
				line-height: 1.4;
				border: none;
				&.default {
					background-image: url("@{URL}/weixinpl/shopping-temp/images/price.png")
				}
				&.weixin {
					background-image: url("@{URL}/weixinpl/shopping-temp/images/weixin_pay.png");
				}
				&.apply {
					background-image: url("@{URL}/weixinpl/shopping-temp/images/apply.png");
				}
				&:last-of-type {
					&::after {
						display: none;
					}
				}
				&::after {
					content:'';
					position: absolute;
					height: auto;
					bottom: 0;
					left: 0;
					width: 100%;
					border-style: dashed;
					border-width: 1px 0 0 0;
					border-color: #f1f1f1;
					transform: scale(1);
					border-radius: 0;
					top: auto;
				}
			}
		}
	}
	.model {
		height: 100%;
		position: fixed;
		width: 100%;
		top:0;
		left: 0;
		display: flex;
		align-items: flex-end;
		z-index: 4;
		.statubar {
			height: 100%;
			width: 100%;
			position: fixed;
			top: 0;
			left:0;
			background:rgba(0,0,0,.5);
			z-index: 88;
		}
		.main {
			position: relative;
			z-index: 99;
			background:white;
			width: 100%;
			.password-input {
				display: flex;
				width: 90%;
				border: 1px solid #ddd;
				margin: 0 auto;
				margin-top: 50upx;
				background-color: #fff;
				border-radius: 3px;
				view {
					flex: 1;
					border-right: 1px solid #ccc;
					position: relative;
					& > view {
						width: 100%;
						padding-top: 100%;
						&.act {
							&::after {
								display: flex;
								align-items: center;
								justify-content: center;
								box-sizing: border-box;
								content: '\2022';
								position: absolute;
								width: 100%;
								height: 100%;
								top: 0;
								left: 0;
								font-size: 52upx;
							}
						}
					}
					&:nth-child(6) {
						border: none;
					}
				}
			}
			.keyboard {
				width: 100%;
				display: flex;
				background-color: #fff;
				border-top: 1px solid #eee;
				margin-top: 50upx;
				.number {
					display: flex;
					flex: 1;
					flex-decration: column;
					flex-flow:column;
					border-right:1px solid #eee;
					box-sizing: border-box;
					view {
						flex: 1;
						display: flex;
						& > view {
							flex: 1;
							align-items: center;
							justify-content: center;
							border-bottom:1px solid #eee;
							border-right:1px solid #eee;
							box-sizing: border-box;
							&:nth-of-type(3n) {
								border-right: 0
							}
						}
						&:last-of-type{
							& > view {
								border-bottom: 0;
							}
						}
						
					}
				}
				.ctr-btn {
					width: 180upx;
					view {
						height: 240upx;
						line-height: 240upx;
						text-align: center;
						box-sizing: border-box;
						border-bottom: 1px solid #eee;
						.iconfont {
							font-size: 44upx !important;
							color: #c30;
						}
						&:nth-child(1) {
							background-repeat: no-repeat;
							background-position: center center;
							background-size: 50upx 50upx;
							background-image: url("@{URL}/weixinpl/shopping-temp/images/backspace.svg");
						}
						&:nth-child(2) {
							font-size: 30upx;
							color: #c30;
						}
					}
				}
				.active { background-color: #e4e7ed; }
			}
		}
	}
}
</style>