<template>
	<view class="cashList">
		<view class="list">
			<view class="title">其他提现方式</view>
			<view class="pay">
				<view @tap="toPay(item.id)" :class="['item', {vip: item.type === 4, weixin: item.id === 1}]" v-for="(item, index) in payList" :key="index">
					<view>{{ item.name }}</view>
					<view>{{ item.bind }}</view>
				</view>
			</view>
		</view>
		<view class="control">
			<button type="default" size="mini">提现记录</button>
			<button type="primary" size="mini">提现账号管理</button>
			<button type="warn" size="mini">确认提现账号</button>
		</view>
	</view>
</template>

<script>
	import { MoneyCash } from '@/common/api'
	import { mapState } from 'vuex'
	export default {
		name:'cashlist',
		data() {
			return {
				payList: [],
				user_id: ''
			}
		},
		onLoad() {
			this.user_id = this.userInfo.id
			this.getList()
		},
		methods: {
			getList () {
				const user_id = this.user_id
				uni.showLoading()
				MoneyCash({ user_id }).then(res => {
					uni.hideLoading()
					if (!res.data.code) {
						this.payList = res.data.data.bind
					}
				})
			}
		},
		computed:{
			...mapState([
				'userInfo'
			])
		}
	}
</script>

<style lang="less">
.cashList {
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
				display: flex;
				justify-content:space-between;
				& > view {
					&:last-of-type {
						color:#666;
						padding-right: 25upx;
					}
				}
				&.default {
					background-image: url("https://admin.sinlu.net/weixinpl/shopping-temp/images/price.png")
				}
				&.weixin {
					background-image: url("https://admin.sinlu.net/weixinpl/shopping-temp/images/weixin_pay.png");
				}
				&.vip {
					background-image: url("https://admin.sinlu.net/weixinpl/shopping-temp/images/pay_vip.png");
				}
				&:last-of-type {
					&::after {
						display: none;
					}
				}
				&::before {
					content: '';
					position: absolute;
					top: 50%;
					right:0;
					width: 15upx;
					height: 15upx;
					transform: translate(0,-50%) rotate(45deg);
					border-top: 1px solid #999;
					border-right:1px solid #999;
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
	.control {
		display: flex;
		justify-content: space-between;
		margin: 30upx 0;
	}
}
</style>
