<template>
	<view>
		<view class="member" v-if='card_id'>
			<view class='head'></view>
			<view class='middle'>
				<image :src='show_card.imgurl'></image>
				<view>{{show_card.name}}</view>
				<view>{{show_card.card_type}}编号</view>
				<view>{{card_members.id}}</view>
			</view>
			<view class='footer'>
				<view class='footer-head'>
					<image :src="baseURL+'/weixinpl/shopping-temp/images/payPacket.png'"></image>
					<text>使用时请出示此卡</text>
				</view>
				<view class='footer-middle'>
					<view @click='gotoXiaofei'>
						<text>消费总额</text>
						<text>{{member_consumes.total_consume+erp_score}}元</text>
					</view>
					<view @click='gotoJifen'>
						<text>剩余积分</text>
						<text>{{remain_score+erp_score}}分</text>
					</view>
					<view @click='gotoMoney'>
						<text>剩余金额</text>
						<text>{{member_consumes.remain_consume}}元</text>
					</view>
				</view>
				<view class='footer-footer' @click='gotoJifen'>
					<view style="color: #DC143C"> {{todayStatus}}</view>
				</view>
				<view class='footer-footer' @click='shopStore'>
					<view>门店列表</view>
				</view>
			</view>
		</view>
		<view class='member' v-if="card_id==''">
			<view class='middle' v-for="(item,index) in vipCard" :key='index' @click='tabT(item.card_id)'>
				<image :src='item.imgurl'></image>
				<view>{{item.name}}</view>
				<view>会员卡编号</view>
				<view>{{item.card_number}}</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		vipCard,
		showCard,
		scoreSign
	} from '@/common/api'
	import {
		mapState
	} from 'vuex'
	import { baseURL } from '@/common/utils/config'

	export default {
		data() {
			return {
				baseURL: baseURL,
				vipCard: '',
				card_id: '',
				show_card: '',
				card_members: '',
				member_consumes: '', //消费总额
				remain_score: '',
				erp_score: '',
				todayStatus: '',
			};
		},
		created() {
			vipCard({
				user_id: this.userInfo.id,
				type: 1
			}).then(res => {
				this.vipCard = res.data
			})

		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		methods: {
			tabT(e) {
				var card_id = e

				this.tab = 2,
					this.card_id = card_id

				showCard({
					user_id: this.userInfo.id,
					card_id: card_id
				}).then(res => {
					if (!res.data.code) {
						this.show_card = res.data.data.show_card,
							this.card_members = res.data.data.card_members[0],
							this.member_consumes = res.data.data.member_consumes, //消费总额
							this.erp_score = res.data.data.erp_score,
							this.remain_score = res.data.data.remain_score //剩余积分	
					} else {
						uni.showModal({
							title: '提示',
							content: res.data.message,
							showCancel: false,
							success: res => {
								if (res.confirm) {
									uni.navigateBack()
								}
							}
						})
					}
				})
				scoreSign({
					user_id: this.userInfo.id,
					card_id: this.card_id
				}).then(res => {
					if (!res.data.code) {
						this.score = res.data.data.dayData,
							this.todayStatus = res.data.data.todayStatus
					}
				})
			},
			gotoXiaofei() {
				uni.navigateTo({
					url: '/pages/my-member-money?card_id=' + this.card_id,
				})
			},
			gotoMoney() {
				uni.navigateTo({
					url: '/pages/my-member-money?card_id=' + this.card_id,
				})
			},
			gotoJifen() {
				uni.navigateTo({
					url: '/pages/integral/index?card_id=' + this.card_id,
				})
			},
			shopStore: function() {
				uni.navigateTo({
					url: '/packageB/pages/my_shop_store?card_id=' + this.card_id,
				})
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
	.member {
		display: flex;
		flex-direction: column;

		.head {
			height: 140rpx;
			width: 100%;
			background-color: #666;
			position: absolute;
		}

		.middle {
			position: relative;
			top: 50rpx;
			left: 100rpx;
			display: flex;
			flex-direction: column;
			height: 174px;

			&>image {
				position: absolute;
				height: 330rpx;
				width: 550rpx;
				border-radius: 20rpx;
			}

			view:nth-child(2) {
				position: relative;
				top: 10px;
				left: 48%;
				font-size: 12px;
				color: #00f;
			}

			view:nth-child(3) {
				position: relative;
				top: 200rpx;
				left: 50%;
				color: #333;
				font-size: 12px;
			}

			view:nth-child(4) {
				position: relative;
				top: 210rpx;
				left: 50%;
				color: #333;
				font-size: 18px;
				font-weight: bold;
			}

		}

		.footer {
			display: flex;
			flex-direction: column;
			margin-top: 20px;

			.footer-head {
				margin-top: 30rpx;
				display: flex;
				justify-content: center;

				image {
					margin: auto 0;
					height: 35rpx;
					width: 35rpx;
				}

			}

			.footer-middle {
				margin-top: 10px;
				background-color: #fff;
				display: flex;
				justify-content: space-around;
				border: 1px solid #ccc;
				border-radius: 10rpx;
				padding: 10px 20px;

				view {
					text-align: center;
					display: flex;
					flex-direction: column;
					border-right: 1px dashed #CCC;

					padding-right: 20PX;

					&:last-child {
						border-right: none;
					}
				}
			}

			.footer-footer {
				background-color: #fff;
				margin-top: 10px;
				text-align: center;
				border: 1px solid #ccc;
				padding: 10px;
				border-radius: 10rpx;

				view {
					background-color: #fff;
					border: 1px solid #ccc;
					padding: 10px;
					border-radius: 10rpx;
				}
			}
		}

	}
</style>
