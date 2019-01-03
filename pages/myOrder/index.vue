<template>
	<view class="orders">
		<view class="tabs">
			<view>
				<view  v-for="(item, index) in tabs" :key="index" :class="{act: index === currentIndex}" @click="change(item, index)">
					<text> {{ item.name }} </text>
				</view>
			</view>
		</view>
		<view class="list" v-if="list.length">
			<scroll-view class="srx" scroll-y @scrolltoupper="refresh" @scrolltolower="loadMove">
				<view class="item" v-for="(data, index) in list" :key="index">
					<view class="date">
						<text> {{data.createtime}} </text>
						<text>
							<block v-if="data.status === 0 && data.paystatus === 0">待付款</block>
							<block v-if="data.status === 0 && data.paystatus === 1 && data.sendstatus === 0">待发货</block>
							<block v-if="data.status === 0 && data.paystatus === 1 && data.sendstatus === 1">配送中</block>
							<block v-if="data.status === 0 && data.sendstatus === 2 && data.is_discuss === 0 || data.status === 1 && data.sendstatus === 2 && data.is_discuss === 0">待评价</block>
							<block v-if="data.return_status === 0 && data.sendstatus>2">申请售后中</block>
							<block v-if="data.return_status === -1 && data.sendstatus>2">退货失败</block>
							<block v-if="data.return_status === 1 && data.sendstatus>2">退货成功</block>
							<block v-if="data.return_status === 2 && data.sendstatus>2">商家同意退货</block>
							<block v-if="data.return_status === 3 && data.sendstatus>2">驳回请求</block>
							<block v-if="(data.return_status === 4 || data.return_status === 5) && data.sendstatus>2">用户退货中</block>
							<block v-if="(data.return_status=== 6) && data.sendstatus>2">商家已收货</block>
							<block v-if="data.return_status === 8 && data.sendstatus === 3">同意退款</block>
							<block v-if="data.return_status === 8 && data.sendstatus === 6">已退款</block>
							<block v-if="data.return_status === 9 && data.sendstatus>2">驳回退款</block>
							<block v-if="data.status === -1">订单已取消</block>
							<block v-if="data.status === 0 && data.sendstatus===2 && data.is_discuss===1 || data.status===1 && data.sendstatus===2 && data.is_discuss===1">订单已完成</block>
							<block v-if="data.status === -2">订单已失效</block>
						</text>
					</view>
					<view class="info">
						<navigator hover-class="none" :url="'/pages/orderDetail/index?batchcode='+data.batchcode+'&tag='+(data.tag || 1)">
							<view class="o_o" v-for="(item, idx) in data.shop_orders" :key="idx">
								<view class="cover">
									<view class="img" :style="{backgroundImage: item.default_imgurl ? 'url('+item.default_imgurl+')' : 'url('+baseURL+'/weixinpl/shopping-temp/images/none.png)'}"></view>
								</view>
								<view class="dsc">
									<view class="name">
										<text>{{ item.pname }}</text>
										<text>&yen;{{ item.now_price }}</text>
									</view>
									<view class="num">x{{ item.rcount }}</view>
								</view>
							</view>
						</navigator>
					</view>
					<view class="count">
						<text>共计{{data.rcount}}件商品 合计：&yen;{{data.pay_money}}</text>
					</view>
					<view class="control">
						<block v-if="data.status !== -2">
							<view v-if="data.status === 0 && data.paystatus === 0 " @click="cOrder(data)">取消订单</view>
							<navigator hover-class="none" :url="'/pages/orderDetail/index?batchcode=' + data.batchcode+'&tag='+(data.tag || 1)" v-if="data.status === 0 && data.paystatus === 0">立即支付</navigator>
							<navigator hover-class="none" :url="'/packageB/pages/refund/index?batchcode=' + data.batchcode+'&tag='+(data.tag || 1)" v-if="data.status === 0 && data.sendstatus === 2 || data.status === 1 && data.sendstatus === 2">申请售后</navigator>
							<navigator hover-class="none" :url="'/packageB/pages/refund/index?batchcode=' + data.batchcode+'&tag='+data.tag" v-if="(data.status === 0 && data.sendstatus === 0 || data.status === 0 && data.sendstatus=== 1) && data.paystatus !== 0">申请退款</navigator>
							<view @click="shopRemind(data.batchcode)" v-if="data.status=== 0 && data.paystatus === 1 && data.sendstatus === 0">提醒发货</view>
							<view v-if="data.status=== 0 && data.paystatus === 1 && data.sendstatus === 1" @tap="conOrder(data)">确认收货</view>
							<navigator hover-class="none" :url="'/pages/comment/index?batchcode='+data.batchcode+'&tag='+(data.tag || 1)" v-if="data.status === 0 && data.sendstatus === 2 && data.is_discuss === 0 || data.status === 1 && data.sendstatus === 2 && data.is_discuss === 0">评价晒单</navigator>
						</block>						
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="no-data" v-if="noData && !list.length">
			<empty-data>你还没有相关订单</empty-data>
		</view>
	</view>
</template>

<script>
	import { myOrder, CancelOrder, orderRemind, confirmOrder, BagOrderList, BagConfirm, BagConcel } from '@/common/api'
	import { mapState } from 'vuex'
	import { baseURL } from '@/common/utils/config'
	export default {
		name: 'orders',
		data() {
			return {
				baseURL: baseURL,
				currentIndex: 0,
				noData: false, 
				tabs: [
					{ name: '全部', act: 1 },
					{ name: '大礼包', act: 0 },
					{ name: '待付款', act: 2 },
					{ name: '待发货', act: 3 },
					{ name: '待收货', act: 4 },
					{ name: '待评价', act: 5 },
					{ name: '退款/售后', act: 8 }
				],
				load: false,
				list: [],
				params: {
					act: 1,
					page: 1
				},
				same: {}
			};
		},
		onShow () {
			if(this.userInfo.customer_id === 1190) this.tabs = this.tabs.filter(item => item.act !== 0)
			this.params.user_id = this.userInfo.id || ''
			this.same.uname = this.userInfo.uname,
			this.same.ticket = this.userInfo.ticket,
			this.same.user_id = this.userInfo.id
			this.params.page = 1
			this.list = []
			if (this.currentIndex === 1) {
				this.getBagList()
			} else {
				this.getList()
			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		methods: {
			change(item, idx) {
				this.currentIndex = idx
				this.list = []
				this.params.page = 1
				if (item.act !== 0) {
					this.params.act = item.act
					this.getList()
				} else {
					this.getBagList()
				}
			},
			conOrder (data) {
				uni.showModal({
					title: '',
					content: '你确认收货吗？',
					success: res => {
						if (res.confirm) {
							uni.showLoading()
							let confirmBtn, params
							if (data.tag === 2) {
								confirmBtn = BagConfirm
								params = { batchcode: data.batchcode } 
							} else {
								confirmBtn = confirmOrder
								params = {
									ticket: this.userInfo.ticket,
									uname: this.userInfo.uname,
									user_id: this.userInfo.id,
									batchcode: data.batchcode
								}
							}
							confirmBtn(params).then(res => {
								uni.hideLoading()
								if (res.code === 400000 || !res.data.status) {
									uni.showModal({
										title: '',
										content: '收货成功',
										showCancel: false,
										complete() {
											data.sendstatus = 2
										}
									})
								} else {
									uni.showModal({
										title: '',
										content: '收货失败',
										showCancel: false
									})
								}
							})
						}
					}
				})
			},
			getList () {
				this.load = false
				uni.showLoading()
				myOrder(this.params).then(res => {
					uni.hideLoading()
					if (res.data.length) {
						const data = res.data
						for (let i = 0; i < data.length; i++) {
							let tolal = parseFloat(data[i].totalprice)
							let sendNum = parseFloat(data[i].sendMoney)
							data[i].totalprice = (tolal + sendNum).toFixed(2);
							let rcount = 0;
							for (let k = 0; k < data[i].shop_orders.length; k++) {
								rcount += data[i].shop_orders[k].rcount;
								data[i].shop_orders[k].now_price = (data[i].shop_orders[k].totalprice / data[i].shop_orders[k].rcount).toFixed(2);
							}
							data.rcount = rcount;
							//计算未支付订单失效时间
							if (data[i].status == 0 && data[i].paystatus == 0) {
								let now_date = new Date();
								let create_date = Date.parse(data[i].shop_orders[0].recovery_time);
								if ((now_date.getTime() - create_date) > 0) {
									data[i].status = -2
								}
							}
						}
						this.noData = false
						this.load = true
						this.list = [...this.list, ...data]
					} else {
						this.$nextTick(() => {
							this.noData = true
							if (this.params.page !== 1) {
								uni.showToast({
									title: '没有更多订单啦>_<',
									icon: 'none'
								})
							}
						})
					}
				})
			},
			getBagList () {
				uni.showLoading()
				BagOrderList(this.params).then(res => {
					uni.hideLoading()
					if (res.data.data.length) {
						const bag = res.data.data
						let data = []
						bag.forEach(item => {
							let list = {}
							list.act = 1
							list.aftersale_type = 0
							list.batchcode = item.batchcode
							list.couponPrice = 0
							list.createtime = item.createtime
							list.decrease_money = 0
							list.expressnum = item.expressnum
							list.id = 0
							list.is_discuss = 0
							list.pay_currency = 0
							list.pay_money = item.package_price
							list.paystatus = item.paystatus
				            list.pid = item.p_id
							list.pname = item.package_name
							list.rcount = item.rcount
							list.return_status = item.return_status
							list.snedMoney = 0
							list.sendstatus = item.sendstatus
							list.shop_orders = [
								{ default_imgurl: item.default_head_imgurl, pname: item.package_name, rcount: item.rcount, now_price: item.package_price }
							]
							list.status = 0
							list.totalprice = item.totalprice
							list.tag = 2
							data.push(list)
						})
						this.noData = false
						this.load = true
						this.list = [...this.list, ...data]
					} else {
						this.$nextTick(() => {
							this.noData = true
							if (this.params.page !== 1) {
								uni.showToast({
									title: '没有更多订单啦>_<',
									icon: 'none'
								})
							}
						})
					}
				})
			},
			shopRemind (batchcode) {
				uni.showLoading()
				const params = Object.assign({}, this.same, { batchcode })
				orderRemind(params).then(res => {
					uni.hideLoading()
					if (res.data.code === 400000) {
						uni.showModal({
							title:'',
							content: res.data.message,
							showCancel: false
						})
					}
				})
			},
			cOrder(data) {
				const params = Object.assign({}, this.same, { batchcode: data.batchcode })
				uni.showModal({
					title: '',
					content: '确认取消该订单吗?',
					success: res => {
						if (res.confirm) {
							uni.showLoading()
							let canBtn
							data.tag === 2 ? canBtn = BagConcel : canBtn = CancelOrder
							canBtn(params).then(res => {
								uni.hideLoading()
								this.list = this.list.filter(item => item.batchcode !== data.batchcode)
								if (res.data.code === 400000) {
									uni.showToast({
										title: res.data.message
									})
								}
							})
						}
					}
				})
			},
			refresh() {
			},
			loadMove(e) {
				if (this.load) {
					this.params.page++
					if (this.currentIndex === 1) {
						this.getBagList()
					} else {
						this.getList()
					}
				}
			}
		}
	}
</script>

<style lang="less">
	@import '../../common/css/variables.less'; 
	uni-page-body, page { height: 100%;}
	.orders {
		height: 100%;
		display: flex;
		flex-flow: column;
		flex-direction: column;
		overflow: hidden;
		.tabs{
			height: 80upx;
			& > view {
				display: flex;
				font-size: 26upx;
				white-space: nowrap;
				text-align: center;
				& > view {
					flex: 1;
					height: 100%;
					line-height: 80upx;
					position:relative;
					&::after {
						content: '';
						position: absolute;
						left: 0;
						bottom: 0;
						height: 2px;
						width: 100%;
						background-color:#E91E63;
						transition: all .4s;
						transform: scaleX(0);
					}
					&.act {
						color:#E91E63;
						&::after {
							transform: scaleX(.9);
						}
					}
				}
			}
		}
		.list,.no-data {
			flex: 1;
			overflow: hidden;
			background-color:#efefef;
			.srx {
				height: 100%;
				padding: 20upx 0;
				box-sizing: border-box;
				.item {
					background-color:white;
					border-radius: 10px;
					margin: 0 20upx 15upx;
					padding: 15upx;
					&:last-of-type {
						margin-bottom: 0;
					}
					.date {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 15upx;
						font-size: 26upx;
						text {
							&:last-of-type {
								color:#E91E63
							}
						}
					}
					.info {
						.o_o {
							display: flex;
							justify-content: space-between;
							position: relative;
							&:not(:last-of-type) {
								padding-bottom: 15upx;
								margin-bottom: 15upx;
								&:after {
									content: '';
									position: absolute;
									left: 0;
									bottom: 0;
									width: 100%;
									border:1px dashed #f1f1f1;
								}
							}
							.cover {
								width: 180upx;
								margin-right: 15upx;
								.img {
									background-size:cover;
									background-position: top center;
									background-repeat: no-repeat;
									width: 100%;
									padding-top: 100%;
								}
							}
							.dsc {
								flex: 1;
								text-align: right;
								.name {
									font-size: 26upx;
									display: flex;
									justify-content: space-between;
									padding: 15upx 0;
									text {
										&:nth-of-type(1) {
											margin-right: 10upx;
											text-align: left;
										}
									}
								}
								.num {
									font-size: 22upx;
									color:#333
								}
							}
						}
					}
					.count {
						display: flex;
						justify-content:flex-end;
						font-size: 22upx;
						white-space: nowrap;
						.price { font-size: 28upx;}
					}
					.control {
						display: flex;
						justify-content: flex-end;
						margin-top: 15upx;
						view, navigator {
							border:1px solid #efefef;
							font-size: 22upx;
							border-radius: 30upx;
							padding:  10upx 25upx;
							color:#737373;
							margin-right: 15upx;
							&:last-child {
								margin: 0;
							}
						}
					}
				}
				.loading {
					display: flex;
					justify-content: center;
					& > view {
						width: 50upx;
						height: 80upx;
						background-repeat: no-repeat;
						background-size:contain;
						background-position: center;
						background-image: url("@{URL}/weixinpl/shopping-temp/images/loading.png");
						animation: rotate 1s linear infinite;
					}
				}
			}
		}
		.no-data {
			position: relative;
		}
		@keyframes rotate {
			from {
				transform: rotate(0);
			}
			to {
				transform: rotate(360deg);
			}
		}
	}
</style>