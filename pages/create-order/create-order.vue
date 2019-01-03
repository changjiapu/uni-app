<template>
	<view class="create_order">
		<view class='loading-content' style='height:220upx' v-if="isloading">
			<view class='loader2'></view>
			<text class='loading-tips'>加载中...</text>
		</view>
		<block>
			<view class='list'>
				<text>配送方式</text>
				<view class='select'>
					<text :class="{active:send_type==0}">快递</text>
				</view>
			</view>
			<view v-if="is_virtual_shop==0 || dianpuleibie!=5" class='address' @click='gotoAddress'>
				<view class='detail' v-if="address.name&&dianpuleibie===5">
					<view>收货人： {{address.name}} {{address.phone}}</view>
					<view>收货地址： {{address.location_p+address.location_c+address.location_a+address.address}}</view>
				</view>
				<view class='detail' v-if="address.name&&dianpuleibie===1">
					<view>收货人： {{address.name}} {{address.phone}}</view>
					<view>收货地址： {{address.address_location+address.address}}</view>
				</view>
				<view class='detail' v-if="!address.name">
					<view>收货人： 某xx xxxxxx</view>
					<view>收货地址： xx省xx市xxxxx</view>
				</view>
				<image class='arrows-right' :src="baseURL+'/weixinpl/shopping-temp/images/arrows-right.png'"></image>
			</view>
			<view class='title'>
				<image :src="baseURL+'/weixinpl/shopping-temp/images/shop.png'"></image>
				<text>共有{{rcount}}件商品</text>
			</view>
			<view class="product" v-if="!cart_show">
				<view class='list-item' v-for="(item,index) in cart" :key="index">
					<view class='img'>
						<image :src='item.default_imgurl' style='width:100%;height:100%'></image>
					</view>
					<view class='msg-detail'>
						<view class='product-name'>
							{{item.pname}} {{item.remarks}}
						</view>
						<view class='versions'>{{item.prope}} </view>
						<view class='price'>
							<view>数量：{{item.rcount}}</view>
							<view>￥
								<text>{{item.now_price*item.rcount}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class='activity' v-if='totalscore>0'>
				<view class='activity-item'>
					<text>当前需要积分<text style="color:red;" decode>&nbsp;{{totalscore}}</text></text>
				</view>
				<view style="color:#bdbdbd;"> 可用积分{{remain_score}}</view>
			</view>
			<view class='activity' v-if="fullCut>0">
				<view class='activity-item'>
					<text>优惠</text>
				</view>
				<view style="color:red;">￥{{fullCut}}</view>
			</view>
			<view class='activity' @click='onCoupon' v-if="ofCoupon">
				<view class='activity-item'>
					<text>优惠劵</text>
				</view>
				<view class="arrows-right" v-if="!couponMoney || couponMoney=='0'">
					<image :src="baseURL+'/weixinpl/shopping-temp/images/arrows-right.png'" style='width:100%;height:100%'></image>
				</view>
				<view style="color:red;" v-else> 满{{couponNeedMoney}}优惠{{couponMoney}}</view>
			</view>
			<view class='list' v-if="sendMoney!=null && !cart_show">
				<text>运费</text>
				<text v-if="sendMoney!=0" style='color:#c30'>￥{{sendMoney}}</text>
				<text v-else style='color:#c30'>{{message}}</text>
			</view>
			<view class='list' v-if="offsetprice.isOpen==1">
				<text>共{{offsetprice.user_currency}}购物币（可抵扣{{offsetprice.numprice}}）</text>
				<view class="body-view">
					<switch @change="switchChange" disabled='offsetprice.isOk' />
				</view>
			</view>
			<view class='list' @click='selectStore' v-if="pickup==1 && sendMoney!=null">
				<view class='detail'>
					<view>选择门店自提</view>
				</view>
				<text v-if="storeName">{{storeName}}</text>
				<image class='arrows-right' v-else :src="baseURL+'/weixinpl/shopping-temp/images/arrows-right.png'"></image>
			</view>
			<view class='list' @click='requiredValue' v-if="requiredata.status">
				<view class='detail'>
					<view>必填信息：</view>
				</view>
				<image class='arrows-right' :src="baseURL+'/weixinpl/shopping-temp/images/arrows-right.png'"></image>
			</view>
			<view class='list remark'>
				<text>买家留言:</text>
				<input type='text' placeholder='选填，可填写您和商家达成一致的要求' @input="handleInput"></input>
			</view>
			<view class='list remark' @click='groupGet' v-if="getExplain">
				<text>{{getExplain.title}}</text>
				<image class='arrows-right' :src="baseURL+'/weixinpl/shopping-temp/images/arrows-right.png'"></image>
			</view>
			<view :style="{display:groupState?'none':'',padding:10+'px'}">
				<rich-text :nodes="nodes1"></rich-text>
			</view>
			<view class='list remark' v-if="offsetprice.integral!=0">
				<text>积分抵扣</text>
				<text style="color:red;">-{{offsetprice.offsetMoney}}元</text>
			</view>
			<view class='empty' style='height:130rpx;'></view>
			<view class='pay-now'>
				<view class='total-price'>
					<text>合计: </text>
					<text>￥</text>
					<text>{{totalprice}}</text>
				</view>
				<view class='pay-btn' @click='selectPayType'>立即支付</view>
			</view>
		</block>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		payType,
		address,
		scoreSelect,
		coupon,
		sendMoneya,
		fullCutHandle,
		Jurisdi,
		getExplain,
		TodayBuy,
		Create
	} from '@/common/api/index.js'
	import GolbalMethod from '@/common/utils/index.js'
	import {
		baseURL
	} from '@/common/utils/config'
	export default {
		data() {
			return {
				nodes1: '',
				send_type: 0,
				is_virtual_shop: 0,
				rcount: 0, //购买商品数量
				totalprice: 0, //总价
				pay_type: '', //支付方式
				actionSheetHidden: true,
				address: {
					id: '',
					name: ''
				}, //收货地址
				isloaded: false,
				password: '', //支付密码
				passwordInputHidden: true,
				sendData: '',
				inputPassword: '', //输入密码
				isloading: true,
				sendMoney: '',
				message: '',
				pidArr: '',
				conponData: '', //方便优惠券
				couponKeyid: '',
				couponMoney: '',
				couponNeedMoney: '',
				ofCoupon: false,
				pickup: '0',
				storeId: '', //自提id
				storeName: '', //店铺名称
				sendstyle: '',
				cart: [],
				cart_show: false,
				baseURL: baseURL,
				remark: '', //购物留言
				getExplain: '', //拼团说明
				groupState: false,
				grouptype: '', //拼团
				group_id: '0', //参团
				activitie_id: '', //拼团活动的id
				totalscore: '', //总共需要多少积分
				remain_score: '', //用户自己的积分
				fullCut: '',
				offsetprice: {
					isOk: true,
					isOpen: false,
					offsetMoney: '',
					integral: 0,
					is_default: 0,
					is_nopassword: 0,
					nopassword_max: '0',
					numprice: '0',
					user_currency: '0'
				}, //购物币抵扣
				tolalMoney: '', //没有优惠之前的总额]
				requiredata: {}, //需要必填信息参数
				storageData: '', //必填信息内容
				showCartcontainer: false, //是否显示运费详情
				renew_id: '',
				deductible_integral: 0,
				is_pay: 0
			};
		},
		onLoad(options) {
			payType().then(res => {
				this.payType = res.data
			})
			var cart = JSON.parse(options.cart)
			this.is_virtual_shop = cart[0].is_virtual_shop,
				this.conponData = options.cart,
				this.Ddata = options,
				this.pay_type = options.pay_type ? options.pay_type : ''

			scoreSelect({
				user_id: this.userInfo.id
			}).then(res => {
				this.remain_score = res.data.data //用户的可以用的积分
			})
			if (options.grouptype && options.productid) {
				if (options.group_id) {
					var group_id = options.group_id
				} else {
					group_id = '0';
				}
				getExplain({
					type: options.productType
				}).then(res => {
					var getExplain = res.data.data[0];
					this.nodes1 = getExplain.content
					this.getExplain = getExplain,
						this.grouptype = options.grouptype,
						this.activitie_id = options.activitie_id,
						this.group_id = group_id
				})
			}

		},
		onShow() {
			address({
				uname: this.userInfo.uname || '',
				ticket: this.userInfo.ticket || '',
				user_id: this.userInfo.id || ''
			}).then(res => {
				this.isloading = false
				if (res.data.code == 400017) {
					this.address = ''
				} else {
					if (res.data.data) {
						for (var i = 0; i < res.data.data.length; i++) {
							if (res.data.data[i].is_default) {
								var address = res.data.data[i]
								this.address = address
								return
							} else {
								var address = res.data.data[i]
								this.address = address
							}
						}
					}
				}
			})
			//优惠券开关
			var sendCart = JSON.parse(this.conponData);
			coupon({
				user_id: this.userInfo.id,
				product_id: sendCart[0].pid
			}).then(res => {
				if (res.data.code == 0) {
					this.ofCoupon = true
				} else {
					this.ofCoupon = false
				}

			})
			sendMoneya({
				user_id: this.userInfo.id,
				product_info: JSON.stringify(sendCart),
				address_id: ''
			}).then(res => {
				if (res.data.code == 0) {
					if (this.storeName) { //门店自提
						res.data.message.message = '门店自提';
						res.data.message.sendMoney = 0;
					}
					//购物车
					var cart = sendCart;
					var rcount = 0;
					var totalprice = 0;
					var totalscore = 0; //一共需要多少积分
					cart.forEach((item, index) => {
						totalprice = totalprice + item.totalprice
						totalscore = totalscore + item.need_score
						rcount = rcount + item.rcount
						if (index == 0) { //把每个产品的id组合成一个字符串
							this.pidArr = item.pid
						} else {
							//把每个产品的id组合成一个字符串
							this.pidArr = this.pidArr + ',' + item.pid
						}
					})
					fullCutHandle({
						product_info: JSON.stringify(sendCart)
					}).then(rst => {
						if (rst.data.code == 0) {
							totalprice = totalprice - rst.data.message
							var fullCut = this.fullCut + rst.data.message
							this.totalprice = totalprice,
								this.fullCut = rst.data.message

						} else {
							var decrease_money = 0;
						}
					})

					this.totalpriceNow = totalprice
				}
				if (this.Ddata.couponMoney) {
					totalprice = totalprice + res.data.message.sendMoney - this.Ddata.couponMoney;
				} else {
					totalprice = totalprice + res.data.message.sendMoney
				}
				Jurisdi({
					user_id: this.userInfo.id,
					product_info: this.Ddata.cart
				}).then(rew => {
					console.log(rew)
					this.pickup = rew.data.data.pickup,
						this.offsetprice = rew.data.offsetprice, //购物币抵扣
						this.requiredata = rew.data.require,
						this.deductible_integral = rew.data.offsetprice.integral //需要扣除的积分

					if (this.offsetprice.is_default == 1) {
						totalprice = parseFloat(totalprice) - this.offsetprice.numprice
					}
					if (this.offsetprice.offsetMoney != 0) {
						totalprice = parseFloat(totalprice) - this.offsetprice.offsetMoney
					}
					totalprice = totalprice.toFixed(2);
					if (res.data.message.message == '虚拟产品包邮产品买不用费') {
						res.data.message.sendMoney = null;
					}
					if (res.data.message.sendMoney == 0) {
						res.data.message.message = '免邮';
					}
					this.rcount = rcount,
						this.cart = cart,
						this.totalprice = totalprice,
						this.sendMoney = res.data.message.sendMoney,
						this.message = res.data.message.message,
						this.couponKeyid = this.Ddata.couponKeyid ? this.Ddata.couponKeyid : '',
						this.couponMoney = this.Ddata.couponMoney ? this.Ddata.couponMoney : '',
						this.couponNeedMoney = this.Ddata.couponNeedMoney ? this.Ddata.couponNeedMoney : '',
						this.totalscore = totalscore,
						this.tolalMoney = totalprice
					if (parseFloat(this.offsetprice.user_currency) >= this.offsetprice.numprice) {
						this.offsetprice.isOk = false
					}

				})
			})
			uni.getStorage({
				key: 'select_store',
				success: (res) => {
					if (res.data) {
						this.storeId = res.data.storeId,
							this.storeName = res.data.storeName,
							this.sendstyle = '自提'
					}
					if (this.storeName) {
						wx.removeStorage({
							key: 'select_store',
							success: function(res) {}
						})
					}
				}
			})
		},
		methods: {
			onCoupon(event) {
				uni.navigateTo({
					url: 'coupon?pidArr=' + this.pidArr + '&conponData=' + this.conponData + '&couponKeyid=' + this.couponKeyid +
						'&totalpriceNow=' + this.totalpriceNow
				})
			},
			switchChange(event) {
				var e = event.detail.value;
				if (e == true) {
					if (parseFloat(this.offsetprice.user_currency) >= this.offsetprice.numprice) {
						this.totalprice = (parseFloat(this.totalprice) - this.offsetprice.numprice).toFixed(2)
						this.pay_currency = this.offsetprice.numprice

					}
				} else {
					this.totalprice = (parseFloat(this.totalprice) + this.offsetprice.numprice).toFixed(2)
					this.ay_currency = 0

				}
			},
			gotoAddress() {
				uni.navigateTo({
					url: '/pages/address/index?create=true'
				})
			},
			//购物留言
			handleInput(event) {
				this.remark = event.detail.value
			},
			requiredValue() {
				uni.navigateTo({
					url: '/packageA/required?requiredata=' + JSON.stringify(this.requiredata.requiredata)
				})
			},
			selectStore() {
				uni.navigateTo({
					url: '/pages/creat_store/creat_store?options=' + this.options,
				})
			},
			//提交订单
			selectPayType: GolbalMethod.throttle(function(e) {
				// 正常产品执行虚拟产品不执行
				if (this.is_virtual_shop != 1) {
					if (!this.address.name) {
						uni.showModal({
							title: '提示',
							content: '您还没有添加收货地址',
							confirmText: '去添加',
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/address/index'
									})
								}
							}
						})
						return
					}
				}
				//必填信息start
				if (this.requiredata.status == 1) {
					uni.getStorage({
						key: 'setrequired',
						success: (res) => {
							this.storageData = res.data //必填信息

						},
						fail: () => {
							uni.showModal({
								title: '提示',
								content: '亲，请先填写必填信息',
								showCancel: false,
								confirmText: '确定',
								success: function(res) {
									uni.navigateTo({
										url: '/packageA/required?requiredata=' + JSON.stringify(this.requiredata.requiredata)
									})
								}
							})
						}
					})
				}
				if (this.requiredata.status == 1 && !this.storageData) {
					return;
				}
				//必填信息end
				if (this.dianpuleibie == 5) {
					var product = [];
					for (var i = 0; i < this.cart.length; i++) {
						product.push({
							pname: this.cart[i].pname,
							pid: this.cart[i].pid,
							rcount: this.cart[i].rcount,
						})
					}

					TodayBuy({
						user_id: this.userInfo.id,
						product: JSON.stringify(product),
					}).then(res => {

						if (res.data.code != 0) {
							uni.showModal({
								title: '提示',
								content: res.data.msg,
								showCancel: false
							});
							return;
						} else { //生成订单号
							this.pay()
						}
					})
				}
			}, 10000),
			pay() {
				//拼团
				this.actionSheetHidden = true
				var is_collage_product = '';
				if (this.grouptype == 1) { //说明是走拼团路线
					is_collage_product = 1; //说明是第一个买 团长
				}
				if (this.grouptype == 2) {
					is_collage_product = 2; //说明不是第一个买只是参团
				}
				//拼团end
				var cart = []
				if (this.message == '无配送方式') {
					uni.showModal({
						title: '提示',
						content: '产品没有没有您所在的配送方式',
						confirmText: '选择门店',
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/creat_store?options=' + this.options,
								})
							}
						}
					})
					return;
				}
				if (this.totalscore > 0) {

					if (this.totalscore > this.remain_score) {
						uni.showModal({
							title: "提示",
							content: '您的积分不足',
							showCancel: false
						})
						return;
					}
				}
				var requiredata = [];
				if (this.dianpuleibie == 5) {
					for (var i = 0; i < this.cart.length; i++) {
						cart.push({
							pid: this.cart[i].pid,
							supply_id: this.cart[i].supply_id,
							pname: this.cart[i].pname,
							property_id: this.cart[i].property_id,
							prope: this.cart[i].prope,
							rcount: this.cart[i].rcount,
							totalprice: this.cart[i].now_price * this.cart[i].rcount,
							price: this.cart[i].now_price,
							need_score: this.cart[i].need_score * this.cart[i].rcount,
							come_type: 1,
							remark: this.remark, //购物留言
							renew_id: this.renew_id,
							decrease_money: this.cart[i].decrease_money, //满减多少钱
							is_virtual: this.cart[i].is_virtual_shop, //是否是虚拟产品
							extend_money: this.cart[i].extend_money,
						})
						requiredata.push(this.cart[i].pid)
					}
					//必填信息start
					/*判断必填信息里面的产品是否与购物车产品一致*/
					if (this.requiredata.status == 1 && this.storageData && JSON.stringify(requiredata) != this.storageData
						.requiredata) {
						uni.showModal({
							title: '提示',
							content: '亲，请先填写必填信息^_^',
							showCancel: false,
							confirmText: '确定',
							success: res => {
								uni.navigateTo({
									url: '/packageA/required?requiredata=' + JSON.stringify(this.requiredata.requiredata)
								})
							}
						})
						return;
					}
					var storageData = {
						storageData: JSON.stringify(this.storageData.storageData), //必填信息
						imgList: JSON.stringify(this.storageData.imgList)
					}
					//必填信息end     
					var sendData = {
						address_id: this.address.id,
						user_id: this.userInfo.id || '',
						uname: this.userInfo.uname || '',
						ticket: this.userInfo.ticket || '',
						total_price: parseFloat(this.totalpriceNow),
						totalscore: this.totalscore,
						cart: JSON.stringify(cart),
						deductible_money: this.offsetprice.offsetMoney,
						sendMoney: this.sendMoney,
						couponKeyid: this.couponKeyid,
						couponMoney: this.couponMoney,
						sendstyle: this.sendstyle,
						store_id: this.storeId,
						storeName: this.storeName,
						is_collage_product: is_collage_product, //拼团
						activitie_id: this.activitie_id, //拼团活动id  
						group_id: this.group_id,
						openid: this.userInfo.openId || '',
						pay_currency: this.pay_currency || '', //使用的购物币
						tolalMoney: this.tolalMoney,
						storageData: JSON.stringify(storageData),
						deductible_integral: this.deductible_integral
					}
					this.sendData = sendData
					this.createOrder()
				}
			},


			createOrder() {
				uni.showLoading({
					title: '正在提交订单',
					mask: true
				})
				var sendData = this.sendData;
				if (this.dianpuleibie == 5) {
					Create(sendData).then(res => {
						uni.hideLoading();
						if (res.data.code == 400000) {
							this.clearCart();
							setTimeout(rst => {
								uni.redirectTo({
									url: '/pages/pay-order/pay-order?post_data=' + JSON.stringify(this.cart) + '&pay_type=' + this.pay_type +
										'&total_price=' + this.totalprice + '&batchcode=' + res.data.batchcode + '&offsetprice=' + JSON.stringify(
											this.offsetprice),
								})
							}, 1500);
						} else {
							uni.showModal({
								title: '提示',
								content: res.data.msg || '创建订单失败',
								showCancel: false
							});
						}
					})

				}
			},

			//下单成功清除购物车数据
			clearCart() {
				var data = JSON.parse(this.sendData.cart);
				if (data.length > 0) {
					var cart = uni.getStorageSync(this.dianpuleibie + 'shopping-cart');

					for (var i = 0; i < cart.length; i++) {
						if (cart[i].status) {
							cart.splice(i, 1);
							continue
						}
					}


					uni.setStorageSync(this.dianpuleibie + 'shopping-cart', cart);
				}
			},
		},
		computed: {
			...mapState([
				'dianpuleibie',
				'userInfo'
			])
		}
	}
</script>

<style lang="less" scoped>
	.create_order {
		.loading-content {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 220upx;

			.loader2 {
				width: 40upx;
				height: 40upx;
				display: inline-block;
				padding: 0px;
				border-radius: 100%;
				border: 8upx solid;
				border-top-color: #888;
				border-bottom-color: rgba(0, 0, 0, 0.1);
				border-left-color: #888;
				border-right-color: rgba(0, 0, 0, 0.1);
				-webkit-animation: loader2 1s ease-in-out infinite;
				animation: loader2 1s ease-in-out infinite;
			}

			.loading-tips {
				margin-left: 10upx;
				color: #777;
			}
		}

		@keyframes loader2 {
			0% {
				transform: rotate(0deg);
			}

			100% {
				transform: rotate(360deg);
			}
		}

		.list {
			height: 90rpx;
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #fff;
			position: relative;

			&::after {
				content: '';
				width: 710rpx;
				border-top: 1px solid #eee;
				position: absolute;
				bottom: 0;
				left: 20rpx;
			}

			view {
				display: flex;

				text {
					padding: 3px 8px;
					font-size: 24rpx;
					color: #888;
					border: 1px solid #888;
					border-radius: 3px;
					margin-left: 8px;

					&.active {
						color: #c30;
						border: 1px solid #c30;
					}
				}
			}
		}

		.address {
			padding: 20rpx;
			padding-right: 70rpx;
			background-color: #fff;
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			border-bottom: 1px solid #eee;
			position: relative;

			.arrows-right {
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				right: 20rpx;
				top: 50%;
				margin-top: -20rpx;
			}

			.iconfont {
				font-size: 60rpx;
				color: #666;
				margin: 0 25rpx;
			}

			.detail {
				view {
					&:nth-child(1) {
						font-weight: bold;
					}

					&:nth-child(2) {
						font-size: 28rpx;
						color: #666;
						margin-top: 10px;
					}
				}
			}
		}

		.title {
			padding: 0 20rpx;
			height: 90rpx;
			display: flex;
			align-items: center;
			background-color: #fff;
			border-bottom: 1px solid #eee;
			font-size: 26rpx;
			word-spacing: 1px;

			image {
				width: 45rpx;
				height: 45rpx;
				margin-right: 5px;
			}
		}

		.product {
			width: 100%;
			background-color: #fff;
			margin-bottom: 20rpx;
			border-bottom: 1px solid #eee;

			.list-item {
				width: 750rpx;
				padding: 15rpx 0;
				display: flex;

				.img {
					width: 160rpx;
					height: 160rpx;
					margin-left: 20rpx;
					background-color: #eee;
					position: relative;

					&::after {
						content: '';
						width: 710rpx;
						border-top: 1px solid #eee;
						position: absolute;
						bottom: -15rpx;
						left: 0rpx;
					}
				}

				&:last-child {
					.img {
						&::after {
							border-top: none;
						}
					}
				}

				.msg-detail {
					height: 160rpx;
					width: 530rpx;
					padding: 0 20rpx;

					.product-name {
						height: 70rpx;
						line-height: 35rpx;
						font-size: 26rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}

					.versions {
						color: #999;
						font-size: 24rpx;
						margin-top: 2px;
					}

					.price {
						display: flex;
						align-items: flex-end;
						justify-content: space-between;
						font-size: 24rpx;
						margin-top: -2px;
						color: #999;

						view {
							&:nth-child(2) {
								color: #c30;
							}
						}

						.text {
							font-size: 32rpx;
						}
					}
				}
			}
		}

		.remark input {
			width: 540rpx;
			font-size: 26rpx;
			color: #888;
			text-align: right;
		}

		.list.remark::after {
			border-top: none;
		}

		.pay-now {
			background-color: #fff;
			width: 100%;
			height: 110rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			position: fixed;
			bottom: 0;
			border-top: 1px solid #eee;
		}

		.pay-now .total-price {
			font-size: 26rpx;
		}

		.pay-now .total-price text:nth-child(2) {
			color: #c30;
		}

		.pay-now .total-price text:nth-child(3) {
			color: #c30;
			font-size: 34rpx;
		}

		.pay-now .pay-btn {
			width: 250rpx;
			height: 110rpx;
			text-align: center;
			line-height: 110rpx;
			background-color: #409eff;
			color: #fff;
			font-size: 34rpx;
			margin-left: 20rpx;
		}

		/* 支付方式选择面板 */

		.sheet-content {
			background-color: #fff;
			padding: 0 15rpx;
		}

		.sheet-content>view {
			height: 50px;
			font-size: 15px;
			line-height: 50px;
			border-bottom: 1px solid #eee;
		}

		.sheet-content>view:last-child {
			border-bottom: none;
		}

		.sheet-content>view.title {
			text-align: center;
		}

		.sheet-content>view.payMode {
			display: flex;
			align-items: center;
		}

		.sheet-content>view.payMode image {
			width: 25px;
			height: 25px;
			margin-left: 5px;
			margin-right: 10px;
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

		.keyboard .ctr-btn view .iconfont {
			font-size: 44rpx !important;
			color: #c30;
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
			border-bottom: 1px solid #eee;
		}

		.activity.activity-item {
			font-size: 26rpx;
		}

		.arrows-right {
			width: 30rpx;
			height: 30rpx;
		}

		.arrows-right.active {
			transform: rotate(270deg);
		}

		.peosong {
			background-color: #fff;
			margin: 20rpx 0;
			padding: 0 25rpx
		}

		.peosong .head {
			height: 80rpx;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #eee;
			align-items: center;
		}

		.peosong .middle {
			overflow: hidden;
		}

		.peosong .middle .container1 {
			height: 70rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.cart_list {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 25rpx;
			background-color: #fff;
		}

		.cart_container {
			background-color: #fff;
			padding: 0 25rpx;
		}

		.cart_container .cart_item {
			margin-top: 10rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #eee
		}
	}
</style>
