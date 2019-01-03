<template>
<view class="orderDetail">
		<view class="status">
			<view>
				<view v-if="Info.status === 0 && Info.paystatus === 0">待付款</view>
				<view v-if="Info.status === 0 && Info.paystatus === 1 && Info.sendstatus === 0">待发货</view>
				<view v-if="Info.status === 0 && Info.paystatus === 1 && Info.sendstatus === 1">配送中</view>
				<view v-if="Info.status === 0 && Info.sendstatus === 2 && Info.is_discuss ===0 || Info.status === 1 && Info.sendstatus === 2 && Info.is_discuss === 0">待评价</view>
				<view v-if="Info.return_status === 0 && Info.sendstatus > 2">申请售后中</view>
				<view v-if="Info.return_status === -1 && Info.sendstatus > 2">退货失败</view>
				<view v-if="Info.return_status === 1 && Info.sendstatus > 2">退货成功</view>
				<view v-if="Info.return_status === 2 && Info.sendstatus > 2">商家同意退货</view>
				<view v-if="Info.return_status === 3 && Info.sendstatus > 2">驳回请求</view>
				<view v-if="(Info.return_status === 4 || Info.return_status === 5) && Info.sendstatus > 2">用户退货中</view>
				<view v-if="(Info.return_status === 6) && Info.sendstatus > 2">商家已收货</view>
				<view v-if="Info.return_status === 8 && Info.sendstatus === 3">同意退款</view>
				<view v-if="Info.return_status === 8 && Info.sendstatus === 6">已退款</view>
				<view v-if="Info.return_status === 9 && Info.sendstatus > 2">驳回退款</view>
				<view v-if="Info.status === -1">订单已取消</view>
				<view v-if="Info.status === 0 && Info.sendstatus === 2 && Info.is_discuss === 1 || Info.status === 1 && Info.sendstatus === 2 && Info.is_discuss === 1">订单已完成</view>
				<view v-if="Info.status === -2">订单已失效</view>
				<view>物流公司：{{ Info.sendstatus > 0 ? Info.send_express_name : '' }}</view>
				<view>物流单号：{{ Info.sendstatus > 0 ? Info.expressnum : '' }}</view>
			</view>
		</view>
		<view class="address">
			<view>{{ Info.user_name }} {{ Info.phone }}</view>
			<view>{{ Info.address }}</view>
		</view>
		<view class="list">
			<view class="item" v-for="(item, index) in Info.shop_orders" :key="index">
				<view :style="{backgroundImage: 'url('+item.default_imgurl+')'}"></view>
				<view>
					<view>
						<view>
							<text>{{ item.pname }}</text>
							<text>{{ item.name }}</text>
						</view>
						<text>&yen;{{item.now_price}}</text>
					</view>
					<view>
						<text>x{{ item.rcount }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="xx">
			<view>
				<text>订单金额</text>
				<text>&yen;{{ Info.totalprice }}</text>
			</view>
			<view v-if="Info.sendMoney > 0">
				<text>运费</text>
				<text>&yen;{{ Info.sendMoney }}</text>
			</view>
			<view v-if="Info.pay_currency > 0">
				<text>购物币抵扣</text>
				<text>&yen;{{ Info.pay_currency }}</text>
			</view>
			<view v-if="Info.deductible_money > 0">
				<text>积分抵扣</text>
				<text>&yen;{{ Info.deductible_money }}</text>
			</view>
			<view v-if="Info.totleMoney>0">
				<text>总优惠</text>
				<text>&yen;{{ totleMoney }}</text>
			</view>	
            <view>
				<text>实付金额</text>
				<text>&yen;{{ Info.pay_money - Info.deductible_money }}</text>
			</view>			
		</view>
		<view class="orderInfo">
			<view>
				<text>下单日期</text>
				<text>{{ Info.createtime }}</text>
			</view>
			<view>
				<text>订单编号</text>
				<text>{{ Info.batchcode }}</text>
			</view>
			<view>
				<text>发货时间</text>
				<text>
					<block v-if="Info.sendstatus > 0"> {{ Info.confirm_sendtime }}</block>
					<block v-else>不限发货时间</block>
				</text>
			</view>
		</view>
		<view class="cotnrol" v-if="Info.status >= 0 && Info.sendstatus < 3">
				<button size="mini" v-if="Info.status >= 0 && Info.sendstatus < 3 "></button>
				<button size="mini" v-if="Info.status === 0 && Info.paystatus === 0" @tap='cOrder(Info.batchcode)'>取消订单</button>
				<button size="mini" type="warn" v-if="Info.status === 0 && Info.paystatus===0" @tap="showPay = true">立即支付</button>
				<button size="mini" v-if="Info.status === 0 && Info.sendstatus === 2 || Info.status === 1 && Info.sendstatus === 2" @click="Refund">申请售后</button>
				<button size="mini" type="warn" v-if="Info.status === 0 && Info.paystatus === 1 && Info.sendstatus === 0" @tap='shopRemind(Info.batchcode)'>提醒发货</button>
				<button size="mini" @tap="conOrder(Info.batchcode)" type="warn" v-if="Info.status === 0 && Info.paystatus === 1 && Info.sendstatus === 1">确认收货</button>
				<button size="mini" type="primary" @click='waybillDetail'>查看物流</button>
				<button size="mini" @tap="goEvalate" type="warn" v-if="Info.status === 0 && Info.sendstatus === 2 && Info.is_discuss === 0 || Info.status === 1 && Info.sendstatus === 2 && Info.is_discuss === 0">
					评价晒单
				</button>
		</view>
		<pay-list :tag="tag" :detail="Info" v-if="showPay" @on-close="showPay = false"></pay-list>
</view>
	
</template>

<script>
	import { orderDetail, CancelOrder, orderRemind, confirmOrder, BagOrderDetail, BagConfirm, BagConcel } from '@/common/api'
	import PayList from '@/components/payList'
 	import { mapState } from 'vuex'
	export default {
		name: 'orderDetail',
		components: { PayList },
		data () {
			return {
				Info: {},
				tag: 1,
				totleMoney: 0,
				params: {
					batchcode: '',
					user_id: ''
				},
				same: {},
				showPay: false
			}
		},
		onLoad(opt) {
			this.params.batchcode = opt.batchcode
			this.params.user_id = this.userInfo.id
			this.same.ticket = this.userInfo.ticket
			this.same.uname = this.userInfo.uname
			this.same.user_id = this.userInfo.id
			this.tag = +opt.tag
			if (+opt.tag === 2) {
				this.getBagInfo()
			} else {
				this.getInfo()
			}
		},
		methods: {
			getInfo () {
				uni.showLoading()
				orderDetail(this.params).then(res => {
					uni.hideLoading()
					if (res.data.length) {
						const data = res.data[0]
						for (let i = 0; i < data.shop_orders.length; i++) {
                            data.shop_orders[i].now_price = (data.shop_orders[i].totalprice / data.shop_orders[i].rcount);
                        }
						//计算未支付订单失效时间
						if (data.status == 0 && data.paystatus == 0) {
							let now_date = new Date();
							let create_date = Date.parse(data.shop_orders[0].recovery_time);
							if ((now_date.getTime() - create_date) > 0) {
								data.status = -2
							}
						}
						let totleMoney = data.CouponPrice + parseInt(data.decrease_money)
						let totalprice = parseInt(data.totalprice)
						data.totalprice = totalprice
						data.totalprice1 = (data.totalprice + data.sendMoney)
						this.totleMoney = totleMoney
						this.Info = data
					}
				})
			},
			goEvalate () {
				uni.navigateTo({
					url: `/pages/comment/index?batchcode=${this.Info.batchcode}&tag=${this.tag}`
				})
			},
			getBagInfo () {
				uni.showLoading()
				BagOrderDetail(this.params).then(res => {
					uni.hideLoading()
					if (!res.data.code) {
						const data = res.data.data[0]
						let info = {}
						info.CouponPrice = data.totalprice
						info.send_express_name = data.expressname
						info.address = data.location_p + data.location_c + data.location_a + data.address
						info.aftersale_type = 0
						info.batchcode = data.batchcode
						info.createtime = data.createtime
						info.confirm_sendtime = data.confirm_sendtime
						info.decrease_money = 0
						info.deductible_money = 0
						info.expressnum = data.expressnum
						info.id = data.p_id
						info.is_discuss = 0
						info.pay_currency = 0
						info.pay_money = data.package_price
						info.paystatus = data.paystatus
						info.phone = data.phone
						info.pid = data.p_id
						info.pname = data.package_name
						info.rcount = data.rcount
						info.return_status = data.return_status
						info.sendMoney = 0
						info.sendstatus = data.sendstatus
						info.shop_orders = [
							{ default_imgurl: data.default_head_imgurl, pname: data.package_name, rcount: data.rcount, now_price: data.package_price }
						]
						info.status = 0
						info.totalprice = data.totalprice
						info.user_name = ''
						this.Info = info
						
					}
				})
			},
			shopRemind (batchcode) { //提醒发货
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
			cOrder(batchcode) { // 取消订单
			    const params = Object.assign({}, this.same, { batchcode })
				uni.showModal({
					title: '',
					content: '确认取消该订单吗?',
					success: res => {
						if (res.confirm) {
							uni.showLoading()
							let canBtn
							this.tag === 2 ? canBtn = BagConcel : canBtn = CancelOrder
							canBtn(params).then(res => {
								uni.hideLoading()
								this.Info.status = -1
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
			conOrder (batchcode) {
				uni.showModal({
					title: '',
					content: '你确认收货吗？',
					success: res => {
						if (res.confirm) {
							const params = {
								ticket: this.userInfo.ticket,
								uname: this.userInfo.uname,
								batchcode
							}
							uni.showLoading()
							let conBtn
							this.tag === 2 ? conBtn = BagConfirm : conBtn = confirmOrder
							conBtn(Object.assign({}, this.params, this.same)).then(res => {
								uni.hideLoading()
								if (res.code === 400000 || !res.data.status) {
									uni.showModal({
										title: '',
										content: '收货成功',
										showCancel: false,
										success: res => {
											if (res.confirm) {
												uni.navigateBack()
											}
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
			//查看物流信息
			waybillDetail() {
				uni.navigateTo({
					url: '/packageB/pages/waybill/waybill?send_express_name=' + this.Info.send_express_name  + '&expressnum=' + this.Info.expressnum,
				})
			},
			Refund(){
				uni.navigateTo({
					url:"/packageB/pages/refund/index?batchcode="+this.Info.batchcode+'&tag='+this.tag
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
.orderDetail {
	padding-bottom: 110upx;
	.status {
		background-color:#0099ff;
		padding: 25upx 15px;
		& > view {
			& > view {
				display: block;
				font-size: 28upx;
				color:white;
				line-height: 50upx;
				&:nth-of-type(n + 2) {
					color:#afd3ea;
				}
			}
		}
	}
	.address {
		padding: 25upx 15px 25upx 80upx;
		margin: 10px 0;
		font-size: 26upx;
		line-height: 40upx;
		background: url("@{URL}/weixinpl/shopping-temp/images/address_b.png") no-repeat 15px center/40upx 40upx white;
	}
	.list {
		background:white;
		padding: 25upx 15px;
		.item {
			display: flex;
			position: relative;
			padding-bottom: 15px;
			margin-bottom: 15px;
			&:last-of-type {
				margin: 0;
				padding: 0;
				&::after {
					display: none;
				}
			}
			&::after {
				content: '';
				position: absolute;
				left: 0;
				width: 100%;
				border:1px dashed whitesmoke;
				bottom: 0;
			} 
			& > view {
				&:nth-of-type(1) {
					width: 146upx;
					height: 146upx;
					background-repeat: no-repeat;
					background-size: cover;
					background-position: top center;
					margin-right: 15px;
					background-image: url("@{URL}/weixinpl/shopping-temp/images/none.png");
				}
				&:nth-of-type(2) {
				    flex:1;
					display: flex;
					flex-direction: column;
					flex-flow: column;
					justify-content: space-between;
					& > view {
						font-size: 26upx;
						&:nth-of-type(1) {
							display: flex;
							justify-content: space-between;
						}
						&:nth-of-type(2) {
							text-align: right;
						}
					}
				}
			}
		}
	}
	.xx {
		margin: 10px 0;
		overflow: hidden;
		& > view {
			padding: 25upx 15px;
			font-size: 26upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color:white;
			position: relative;
			&:not(:last-of-type) {
				&::before {
					content: '';
					position:absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					border:1px dashed #f1f1f1;
					transform: scaleY(.5);
				}
			}
			&:nth-last-of-type(2) {
				&::before {display: none;}
			}
			&:last-of-type {
				background:#F44336;
				color:white;
				position: relative;
				&::before {
					content: '';
					position: absolute;
					width: 0;
					height: 0;
					border-width: 0 10upx 10upx;
					border-style: solid;
					border-color:transparent transparent #F44336;
					right: 15px;
					top: -8upx;
				}
			}
		}
	}
	.orderInfo {
		background-color:white;
		padding: 25upx 15px;
		font-size: 26upx;
		& > view {
			display: flex;
			justify-content: space-between;
			padding: 10upx 0;
		}
	}
	.cotnrol {
		height: 80upx;
		position:fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		padding: 10upx 15px;
		box-sizing: border-box;
		background-color:white;
		align-items: center;
		justify-content: flex-end;
		button { padding: 0 14px; margin: 0 10px 0 0;&:last-of-type {margin: 0 ;} }
	}
}	
</style>