<template>
<view class="myAssets">
    <view class="head">
		<view>
			<navigator url='/packageB/pages/Record/index'>记录</navigator>
			<view class='money'>
				<view class="image"></view>
				<view class="cash">零钱</view>
				<view><text>￥</text>{{ Info.coin }}</view>
			</view>
			<navigator :url="'/pages/cash/index'">提现</navigator>
		</view>
    </view>	
	<view class="contain">
		<view class="title">功能</view>
		<view class="grid">
			<view class="line" >
				<navigator hover-class="none" url="/pages/currency-history/currency-history">
					<view :style="{backgroundImage: 'url('+baseURL+'/weixinpl/shopping-temp/images/myshop.png)'}"></view>
					<view>
						<text>购物币</text>
						<text>{{ Info.currency }}</text>
					</view>
				</navigator>
				<navigator hover-class="none" url='/pages/my-member/my-member'>
					<view :style="{backgroundImage: 'url('+baseURL+'/weixinpl/shopping-temp/images/vip_card.png)'}"></view>
					<view>
						<text>会员卡</text>
						<text>{{ Info.card }}张</text>
					</view>
				</navigator>
			</view>
			<view class="line">
				<navigator hover-class="none" url='/pages/coupon/coupon'>
					<view :style="{backgroundImage: 'url('+baseURL+'/weixinpl/shopping-temp/images/couppon.png)'}"></view>
					<view>
						<text>优惠券</text>
						<text>{{ Info.coupon }}</text>
					</view>
				</navigator>
				<navigator hover-class="none" url='/pages/setPassword/setPassword'>
					<view :style="{backgroundImage: 'url('+baseURL+'/weixinpl/shopping-temp/images/paypwd.png)'}"></view>
					<view>
						<text>支付密码</text>
						<text>设置/修改</text>
					</view>
				</navigator>
			</view>
		</view>
	</view>
</view>
</template>

<script>
	import { TotalAssets, SwitchWork, UserCoupon, VipCard } from '@/common/api'
	import { mapState } from 'vuex'
	import { baseURL } from '@/common/utils/config'

	export default {
		name: 'myAssets',
		data() {
			return {
				baseURL: baseURL,
				Info: {},
				params: {
					uname: '',
					ticket: ''
				}
			}
		},
		onLoad() {
			this.params.uname = this.userInfo.uname || ''
			this.params.ticket = this.userInfo.ticket || ''
			this.params.user_id = this.userInfo.id || ''
			this.getInfo()
		},
		methods: {
			getInfo() {
				const data = async () => {
					let c = {}
					const Assets = TotalAssets(this.params).then(res => res.data)
					const work = SwitchWork({ ticket: this.userInfo.ticket, uname: this.userInfo.uname }).then(res => res.data)
					const coppon = UserCoupon({ coupon_type: 0, op: 'use', user_id: this.userInfo.id }).then(res => res.data)
					const vipCard = VipCard({ type: 1, user_id: this.userInfo.id }).then(res => res.data)
					let results = await Promise.all([Assets, work, coppon, vipCard])
					c.coin = results[0].data.money
					c.currency = results[0].data.currency
					c.coupon = JSON.parse(results[2]).coupon.length
					c.card = results[3].length
					return c
				}
				data().then(res => { this.Info = res })
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
	@import '../../common/css/variables.less'; 
.myAssets {
	.head {
		background-color:rgb(0, 153, 255);
		color:white;
		padding: 80upx 0 40upx;
		& > view {
			display: flex;
			justify-content: center;
			align-items: center;
			navigator {
				background:white;
				color:#03A9F4;
				border-radius: 30upx;
				padding: 15upx 40upx;
				font-size: 22upx;
				margin: 0 60upx;
			}
			.money {
				text-align:center;
				font-size: 28upx;
				.image {
					width: 110upx;
					height: 110upx;
					background:url("@{URL}/weixinpl/shopping-temp/images/assets.png") no-repeat center center/contain;
					margin: 0 auto;
				}
				.cash {
					padding: 15upx 0;
				}
			}
		}
	}
	.contain {
		.title {
			height: 80upx;
			line-height: 80upx;
			margin: 0 15px;
			font-size: 26upx;
		}
		.grid {
			border-top: 1px solid #e6e6e6;
			border-bottom: 1px solid #e6e6e6;
			background:white;
			.line {
				display: flex;
				justify-content: space-between;
				align-items: center;
				& > navigator{
					flex: 1;
					display: flex;
					border-right:1px solid #e6e6e6;
					margin: 0 15px;
					padding: 20upx 0;
					position: relative;
					&::after {
						content: '';
						position: absolute;
						bottom: 0;
						left: -15px;
						width: calc(100% + 30px);
						border-bottom: 1px solid #e6e6e6;
					}
					&:last-of-type {
						border-right: none
					}
					& > view {
						&:first-of-type {
							width: 80upx;
							height: 80upx;
							background-repeat: no-repeat;
							background-size: contain;
							background-position: center center;
							margin-right: 15upx;
						}
						&:last-of-type {
							display: flex;
							flex-flow: column;
							flex-direction: column;
							justify-content: space-between;
							font-size: 26upx;
						}
					}
				}
				&:last-of-type {
					& > view {
						&::after {
							display: none;
						}
					}
				}
			}
		}
	}
}
</style>
