<template>
	<view>
		<navigator class='address' url='/pages/address/index'>
			<!-- <view class='iconfont icon-address'></view> -->
			<uni-icon type="location" size="30"></uni-icon>
			<view class='detail' v-if="address">
				<view>收货人： {{address.name}} {{address.phone}}</view>
				<view>收货地址： {{address.location_p+address.location_c+address.location_a+address.address}}</view>
			</view>
			<view class='detail' v-else>
				<view>收货人： 某xx xxxxxx</view>
				<view>收货地址： xx省xx市xxxxx</view>
			</view>
			<image class='arrows-right' :src="baseURL+'/weixinpl/shopping-temp/images/arrows-right.png'"></image>
		</navigator>
		<view class='TJpeople '>{{data.exp_user_name}}</view>
		<view class='product'>
			<image :src='data.default_imgurl'></image>
			<view class='product-info'>
				<text>{{data.package_name}}</text>
				<text>￥{{data.price}}</text>
			</view>
		</view>
		<view class='list-msg'>
			<view class='list-msg1'>
				<text>商品金额</text>
				<text>￥{{data.price}}</text>
			</view>
			<view class='list-msg2' @click='bindShowMsg'>
				<text>{{tihuoWay}}</text>
				<image style='height:20rpx;width:20rpx;' :src="baseURL+'/weixinpl/shopping-temp/images/down.png'"></image>
			</view>
			<view class='list-msg1'>
				<text>运费</text>
				<text></text>{{data.e_price}}</view>
			<view class='list-msg1'>
				<text>实际付款</text>
				<text style='color:red'>￥{{data.totalprice}}</text>
			</view>
			<view class="select_box" v-if="select">
				<block v-for="(item,index) in data.res_store" :key='index'>
					<view class="select_one" @click="mySelect(item)">门店:{{item.name}}
						地址:{{item.address}}</view>
				</block>
			</view>
		</view>
		<button @click='buy' style="border-radius:0;">立即付款</button>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		address
	} from '@/common/api/index.js'
	import {
		orderFormGift,
		savePackages
	} from '@/common/api/packageA.js'
	import uniIcon from "@/components/uni-icon.vue"
	import {
		baseURL
	} from '@/common/utils/config'

	export default {
		components: {
			uniIcon
		},
		data() {
			return {
				baseURL: baseURL,
				select: false,
				address: '',
				tihuoWay: '选择门店自提',
				store_id: '',
				isloaded: false,
				data: {
					res_store: []
				}
			};
		},
		onLoad(options) {
			var package_id = options.package_id

			var sendData = {
				user_id: this.userInfo.id,
				package_id: package_id
			}
			orderFormGift(sendData).then(res => {
				if (!res.data.code) {
					this.data = res.data.data
					this.package_id = package_id
				}

			})

		},
		onShow() {
			//收货地址
			var sendData = {
				user_id: this.userInfo.id,
				uname: this.userInfo.uname,
				ticket: this.userInfo.ticket,
			};
			address(sendData).then(res => {
				if (res.data.code == 400017) {
					// 地址为空，用户还没有添加地址
				} else {
					for (var i = 0; i < res.data.data.length; i++) {
						if (res.data.data[i].is_default) {
							this.address = res.data.data[i]
							return
						}
					}
					this.address = res.data.data[0]
				}
			})
			//收货地址结束
		},
		methods: {
			bindShowMsg() {
				console.log(222)
				this.select = !this.select
			},
			mySelect(e) {
				let name = e.name
				let store_id = e.id
				this.store_id = store_id,
					this.tihuoWay = name,
					this.select = false
			},
			buy(e) {
				if (this.address == '') {
					uni.showModal({
						title: '',
						content: '请填写收货地址',
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/address/index'
								})
							}
						}
					})
				} else {
					let data = {
						user_id: this.userInfo.id,
						package_id: this.package_id,
						parent_id: this.data.parent_id,
						name: this.address.name,
						phone: this.address.phone,
						location_p: this.address.location_p,
						location_c: this.address.location_c,
						location_a: this.address.location_a,
						address: this.address.address,
						totalprice: this.data.totalprice,
						e_id: this.data.e_id,
						e_name: this.data.package_name,
						add_id: this.data.add_id,
						pid: '',
						store_id: this.store_id,
					}
					savePackages(data).then(res => {
						if (!res.code) {
							let batchcode = res.data.data.batchcode
							wx.navigateTo({
								url: '/pages/pay-order/pay-order?post_data=' + JSON.stringify(data) + '&batchcode=' + batchcode +
									'&isPackage=true',
							})
						} else {
							uni.showModal({
								title: '',
								content: res.data.msg,
								showCancel: false
							})
							return false
						}
					})

				}
			},


		},
		computed: {
			...mapState([
				'userInfo'
			])
		}
	}
</script>

<style>
	.address {
		padding: 20rpx;
		padding-right: 70rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		border-bottom: 1px solid #e4e7ed;
		position: relative;
	}

	.address .arrows-right {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 20rpx;
		top: 50%;
		margin-top: -20rpx;
	}

	.address .iconfont {
		font-size: 60rpx;
		color: #666;
		margin: 0 25rpx;
	}

	.address .detail view:nth-child(1) {
		font-weight: bold;
	}

	.address .detail view:nth-child(2) {
		font-size: 28rpx;
		color: #666;
		margin-top: 10px;
	}

	.TJpeople {
		padding: 0 20rpx;
		height: 60rpx;
		margin: 0 auto;
	}

	.product {
		padding: 0 20rpx;
		display: flex;
		align-items: center;
		background-color: #eee;
	}

	.product image {
		height: 150rpx;
		width: 150rpx;
	}

	.product-info {
		margin-left: 30rpx;
		display: flex;
		flex-direction: column;
	}

	.list-msg {
		padding: 0 20rpx;
		background-color: #fff;
		position: relative;
	}

	.list-msg1 {
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.list-msg .list-msg2 {
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1px solid #ccc;
		padding: 0 10rpx;
	}

	.select_box {
		font-size: 23rpx;
		background-color: #eee;
		padding: 0 10rpx;
		width: 93%;
		position: absolute;
		top: 130rpx;
		z-index: 1;
		overflow: hidden;
		animation: myfirst 0.5s;
	}

	@keyframes myfirst {
		from {
			height: 0%;
		}

		to {
			height: 100%;
		}
	}

	.select_one {
		height: 60rpx;
		line-height: 60rpx;
		border-bottom: 1px solid #ccc;
	}

	button {
		background-color: #333;
		color: #fff;
		width: 100%;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		position: fixed;
		bottom: 0;
		right: 0;
		z-index: 1;
	}
</style>
