<template>
	<view class="refund">
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
		<view class="service">
			<text @>服务类型</text>
			<text @tap="select(index)" :class="{ act: index === currentTab }" v-for="(item, index) in services" :key="index" v-if="Info.sendstatus === 2 || !index">{{ item }}</text>
		</view>
		<view class="reason">
			<textarea class="text" v-model="reason.reason" placeholder="请填写申请售后的原因，不超过200字" auto-focus/>
		</view>
		<view class="btn">
			<button type="warn" @tap="refund">提交</button>
		</view>
	</view>
</template>

<script>
	import { orderDetail, Refund, BagOrderDetail } from '@/common/api'
	import { mapState } from 'vuex'
	export default {
		name: 'refund',
		data() {
			return {
				params: {
					batchcode: '',
					user_id: ''
				},
				services: ['申请退款', '申请退货'],
				reason: {
					reason: '',
					sendstatus: 5
				},
				currentTab: 0,
				Info: {}
			}
		},
		onLoad(opt) {
			this.params.batchcode = opt.batchcode
			this.params.user_id = this.userInfo.id
			if (+opt.tag === 2) {
				this.getBagInfo()
			} else {
				this.getInfo()
			}
		},
		methods: {
			select (idx) {
				switch(idx) {
					case 0:
					this.currentTab = idx
					this.reason.sendstatus = 5
					break;
					case 1: 
					this.currentTab = idx
					this.reason.sendstatus = 3
					break;
				}
			},
			getInfo() {
				orderDetail(this.params).then(res => {
					let data = res.data[0]
                    for (var i = 0; i < data.shop_orders.length; i++) {
                         data.shop_orders[i].now_price = (data.shop_orders[i].totalprice / data.shop_orders[i].rcount).toFixed(2);
                    }
                    this.Info = data
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
			refund () {
				Refund(Object.assign({}, this.params, this.reason)).then(res => {
					if (res.data.code === 400068) {
						uni.showModal({
							title: '',
							content: res.data.message,
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
							content:res.data.message,
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
		},
	}
</script>

<style lang="less">
@import '../../../common/css/variables.less';	
.refund {
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
	.service {
		padding: 15upx 15px;
		font-size: 26upx;
		display: flex;
		justify-content:flex-start;
		align-items: center;
		background-color:white;
		position: relative;
		margin: 10px 0;
		& > text {
			&:first-of-type {
				margin-right: 15px;
			}
			&:not(:first-of-type) {
				border: 1px solid #e64340;
				color:#e64340;
				font-size: 22upx;
				padding: 10upx 30upx;
				border-radius: 20upx;
				margin-right: 15px;
				&.act {
					background-color: #e64340;
					color:white;
				}
			}
		}
	}
	.reason {
		background-color: white;
		padding:15px;
		.text {
			width: 100%
		}
	}
	.btn {
		margin: 30upx 15px;
	}
}	

</style>
