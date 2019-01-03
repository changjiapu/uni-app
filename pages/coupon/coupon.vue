<template>
	<view>
		<view class='head'>优惠券（{{messData.length||0}}张）</view>
		<view v-if='messData.length>0'>
			<view v-for="(item,index) in messData" :key='index' class='Coupon'>
				<view class='Coupon-item'>
					<view class='Coupon-left'>
						<text>{{item.Money}}￥</text>
						<!--20-->
						<text>{{item.c_content}}</text>
						<!--平台专用劵-->
					</view>
					<view class='Coupon-right'>
						<text>满{{item.NeedMoney}}元即可使用</text>
						<!--满168元即可使用-->
						<text>(不含邮费)</text>
						<text>{{item.p_content}}</text>
						<!--仅限购买商城内的商品使用-->
						<text>{{item.startline}} {{item.deadline}}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="!messData||messData.length<1" class='hint'>----您还没有优惠券!----</view>
	</view>
</template>

<script>
	import {
		UserCoupon
	} from "@/common/api/index"
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				messData: []
			};
		},
		onLoad() {
			var params = {
				user_id: this.userInfo.id,
				coupon_type: 0,
				op: 'use'
			};
			UserCoupon(params).then(res => {
				this.messData = res.data.coupon
			})

		},
		computed: {
			...mapState([
				'userInfo'
			])
		}

	}
</script>

<style lang="less">
	.head {
		height: 100prx;
		line-height: 100rpx;
		text-align: center;
		background-color: #fff
	}

	.Coupon {
		margin-left: 20rpx;
		margin-top: 30rpx;
	}

	.Coupon-item {
		display: flex;
		flex-direction: row;
	}

	.Coupon-left {
		height: 250rpx;
		width: 200rpx;
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background-color: #ff675f;
	}

	.Coupon-left text:nth-child(1) {
		font-size: 56rpx;
		color: #fff;
	}

	.Coupon-left text:nth-child(2) {
		margin-top: 30rpx;
		font-size: 20rpx;
		color: #fff;
	}

	.Coupon-right {
		margin-left: 30rpx;
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
	}

	.Coupon-right text:nth-child(1) {
		color: #ff5c66;
		font-size: 34rpx;
	}

	.Coupon-right text:nth-child(2) {
		margin-top: 10rpx;
		color: #ff5c66;
		font-size: 24rpx;
	}

	.Coupon-right text:nth-child(3) {
		margin-top: 15rpx;
		color: #727272;
		font-size: 26rpx;
	}

	.Coupon-right text:nth-child(4) {
		margin-top: 30rpx;
		color: #a6a6a6;
		font-size: 20rpx;
	}

	.hint {
		text-align: center;
		margin-top: 30rpx;
	}
</style>
