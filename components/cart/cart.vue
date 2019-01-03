<template>
	<view>
		<view v-if="dianpuleibie==5">
			<view class='no-data' style='background-color:#f4f4f4' v-if='no_data'>
				<image :src="baseURL+'/weixinpl/shopping-temp/images/no-data.png'"></image>
				<text>购物车为空，赶紧去逛逛吧~~</text>
			</view>
			<block v-else>
				<view class='title'>
					<text>购物车共有{{all_count}}个商品</text>
					<text @click='Editor'>{{editor?'完成':'编辑'}}</text>
				</view>
				<view class="list">
					<view class='list-item' v-for="(item,index) in cart" :key="index">
						<view class='clear'>
							<image :src="baseURL+'/weixinpl/shopping-temp/images/clear.png'" :style="{display:editor?'':'none'}"
							 @click="clear(index)"></image>
							<view :style="{display:editor?'none':''}" @click='statusChange(index)'>
								<uni-icon v-if="item.status" type="checkbox-filled" size="20" color='#409EFF'></uni-icon>
								<uni-icon v-else type="circle" size="20"></uni-icon>
							</view>
						</view>
						<view class='img'>
							<image :src='item.default_imgurl' style='width:100%;height:100%'></image>
						</view>
						<view class='msg-detail'>
							<view class='product-name'>
								{{item.pname}} {{item.remarks}}
							</view>
							<view class='versions'>{{item.prope}}</view>
							<view class='price'>
								<text>￥</text>{{item.now_price}}
							</view>
						</view>
						<view class='count'>
							<text @click='sub(index)'>-</text>
							<input class='input' type='number' :value='item.rcount' @blur="handleBlur($event, index)"></input>
							<text @click='add(index)'>+</text>
						</view>
					</view>
				</view>
			</block>
			<view class='empty' style='width:100%;height:114upx;'></view>
			<view class='buy-btn'>
				<view class='left' @click='selectAll5'>
					<uni-icon v-if="select_all" type="checkbox-filled" size="20" color='#409EFF'></uni-icon>
					<uni-icon v-else type="circle" size="close"></uni-icon>
					<text>全选</text>
				</view>
				<view class='right'>
					<view>已选{{rcount}}件，总价￥
						<text>{{totalprice}}</text>
					</view>
					<view @click='gotoPay5'>去结算</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import uniIcon from "@/components/uni-icon.vue"
	import { baseURL } from '@/common/utils/config'
	export default {
		name: 'cart',
		components: {
			uniIcon
		},
		data() {
			return {
				baseURL: baseURL,
				empty: '',
				editor: false,
				no_data: true,
				rcount: 0,
				all_count: 0,
				totalprice: '0.00',
				select_all: true,
				prope: '',
				cart: []
			};
		},
		created() {
			let cart = uni.getStorageSync(this.dianpuleibie + 'shopping-cart');
			if (cart) {
				this.cart = cart
			} 
			const e = this.cart
			if (this.dianpuleibie == 5) {
				if (e.length == 0) {
					this.no_data = true
				} else {
					var rcount = 0;
					var totalprice = 0;
					var all_count = 0;
					console.log(e.length)
					for (var i = 0; i < e.length; i++) {
						all_count += e[i].rcount;
						e[i].now_price = parseFloat(e[i].now_price).toFixed(2);
						e[i].totalprice = e[i].rcount * parseFloat(e[i].now_price);
						if (e[i].status) {
							rcount += e[i].rcount;
							totalprice = totalprice + e[i].totalprice;
						}
						if (!e[i].status) {
							this.select_all = false
						}
					}

					this.all_count = all_count,
						this.no_data = false,
						this.rcount = rcount,
						this.totalprice = totalprice.toFixed(2)
				}
			}
		},

		methods: {
			Editor() {
				this.editor = !this.editor
			},
			clear(e) {
				this.cart.splice(e, 1);
				this.dataChange();
			},
			dataChange() {
				var cart = this.cart;

				var rcount = 0,
					totalprice = 0,
					all_count = 0;
				for (var i = 0; i < cart.length; i++) {
					all_count += cart[i].rcount;
					cart[i].totalprice = cart[i].rcount * parseFloat(cart[i].now_price)
					if (cart[i].status) {
						rcount += cart[i].rcount;
						totalprice += cart[i].totalprice;
					}
					if (!cart[i].status) {
						this.select_all = false
					}
				}
				totalprice = totalprice.toFixed(2);
				this.all_count = all_count,
					this.rcount = rcount,
					this.totalprice = totalprice
				if (cart.length == 0) {
					this.no_data = true
				}
				uni.setStorageSync(this.dianpuleibie + 'shopping-cart', cart);
			},
			statusChange(e) {
				var index = e
				this.cart[index].status = !this.cart[index].status;
				this.dataChange();
			},
			//选择全部
			selectAll5() {
				this.select_all = !this.select_all
				for (var i = 0; i < this.cart.length; i++) {
					this.cart[i].status = this.select_all
				}
				this.dataChange();
			},

			//数量减一
			sub(e) {
				if (this.cart[e].rcount > 1) {
					this.cart[e].rcount--;
					this.dataChange();
				}
			},
			//数量加一
			add(e) {
				this.cart[e].rcount++;
				this.dataChange();
			},
			handleBlur(event, index) {
				console.log(event, index)
				var reg = /^\+?[1-9][0-9]*$/;
				if (reg.test(event.detail.value)) {
					this.cart[index].rcount = parseInt(event.detail.value);
					this.dataChange();
				} else {
					uni.showModal({
						title: '请输入正确数量',
						showCancel: false
					})
				}
			},
			//去结算
			gotoPay5() {
				var cart = this.cart,
					temp = [];
				for (var i = 0; i < cart.length; i++) {
					if (cart[i].status) {
						temp.push(cart[i]);
					}
				}
				if (temp.length == 0) {
					return
				}
				uni.navigateTo({
					url: '/pages/create-order/create-order?cart=' + JSON.stringify(temp),
				})
			},


		},
		computed: {
			...mapState([
				'dianpuleibie'
			])
		}
	}
</script>

<style scoped>
	.no-data {
		height: 400upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		color: #707070;
	}

	.no-data image {
		width: 150upx;
		height: 150upx;
		margin-bottom: 40upx;
	}

	.title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20upx;
		height: 80upx;
		background-color: #eee;
		font-size: 28upx;
		color: #888;
	}

	.title text:nth-child(2) {
		color: #c30;
		font-size: 30upx;
	}

	.list {
		width: 100%;
		overflow: hidden;
		background-color: #fff;
	}

	.list .list-item {
		width: 750upx;
		padding: 15upx 0;
		display: flex;
		position: relative;
	}

	.list .list-item .clear {
		width: 70upx;
		height: 160upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.list .list-item .clear image {
		width: 40upx;
		height: 40upx;
	}

	.list .list-item .img {
		width: 160upx;
		height: 160upx;
		margin-left: 20upx;
		background-color: #eee;
		position: relative;
	}

	.list .list-item .img::after {
		content: '';
		width: 710upx;
		border-top: 1px solid #eee;
		position: absolute;
		bottom: -15upx;
		left: 0upx;
	}

	.list .list-item .msg-detail {
		height: 160upx;
		width: 460upx;
		padding: 0 20upx;
	}

	.list .list-item .msg-detail .product-name {
		font-size: 28upx;
		height: 80upx;
		line-height: 40upx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.list .list-item .msg-detail .versions {
		color: #999;
		font-size: 24upx;
		margin-top: 3px;
	}

	.list .list-item .msg-detail .price {
		color: #c30;
		font-size: 32upx;
		margin-top: 3px;
	}

	.list .list-item .msg-detail .price text {
		font-size: 24upx;
	}

	.list .list-item .count {
		position: absolute;
		right: 20upx;
		bottom: 15upx;
		width: 170upx;
		height: 50upx;
		font-size: 26upx;
		border-radius: 3px;
		color: #555;
		border: 1px solid #ddd;
		display: flex;
	}

	.list .list-item .count text {
		width: 50upx;
		text-align: center;
		height: 50upx;
		line-height: 50upx;
		box-sizing: border-box;
		border-right: 1px solid #ddd;
	}

	.list .list-item .count text:nth-child(3) {
		border-right: none;
	}

	.list .list-item .count input {
		width: 70upx;
		text-align: center;
		height: 50upx;
		line-height: 50upx;
		box-sizing: border-box;
		border-right: 1px solid #ddd;
	}


	.buy-btn {
		width: 100%;
		height: 112upx;
		position: fixed;
		bottom: 110upx;
		background-color: #fff;
		padding-bottom: 5px;
		z-index: 2000;
		border-top: 1px solid #eee;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.buy-btn .left {
		margin-left: 25upx;
		display: flex;
		align-items: center;
	}

	.buy-btn .left icon {
		display: block;
	}

	.buy-btn .left text {
		margin-left: 5px;
	}

	.buy-btn .right {
		font-size: 24upx;
		color: #999;
		display: flex;
		align-items: center;
	}

	.buy-btn .right view text {
		font-size: 34upx;
		color: #c30;
	}

	.buy-btn .right view:nth-child(2) {
		width: 180upx;
		height: 112upx;
		line-height: 112upx;
		text-align: center;
		color: #fff;
		background-color: #409EFF;
		font-size: 34upx;
		margin-left: 5px;
	}

	icon {
		display: block;
	}

	/* page {
    background-color: #f8f8f8;
} */
</style>
