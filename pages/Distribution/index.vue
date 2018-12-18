<template>
	<view class="distribution">
		<view class="head">
			<view>
				<view :style="{ backgroundImage: 'url('+(userInfo.avatarUrl || 'https://admin.sinlu.net/weixinpl/shopping-temp/images/default.png')+')' }"></view>
			</view>
			<view>
				<text class="name">{{ userInfo.nickName }}</text>
				<text class="id">推荐人:{{ Info.exp_weixin_name || '无'  }}</text>
			</view>
		</view>
		<view class="list">
			<view>
				<view>
					<text>待结算(当月)</text>
					<text>{{Info.usermoney.total_profiy}}元</text>
				</view>
				<view>
					<text>已结算(当月)</text>
					<text>{{Info.usermoney.total_money}}元</text>
				</view>
			</view>
			<view>
				<navigator hover-class="none" url='/pages/distribution-group/distribution-group'>
					<view class="myTeam"></view>
					<text>我的团队({{Info.count}})人</text>
				</navigator>
				<!-- #ifdef MP-WEIXIN -->
				<navigator hover-class="none">
					<view class="myCode"></view>
					<text>推广二维码</text>
				</navigator>
				<!-- #endif -->
				<navigator hover-class="none" url="/pages/distributionView/index">
					<view class="myYield"></view>
					<text>累积收益</text>
				</navigator>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		Distribution
	} from '@/common/api'
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'distribution',
		data() {
			return {
				Info: {
				usermoney:{}	
				}
			}
		},
		onLoad() {
			this.getInfo()
		},
		methods: {
			getInfo() {
				const myDate = new Date()
				const time = myDate.getFullYear() + '-' + (myDate.getMonth() + 1); //获取完整的年份和月份
				Distribution({
					time,
					user_id:this.userInfo.id
				}).then(res => {
					console.log(res)
					if (!res.data.code) {
						this.Info = res.data.data
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
	.distribution {
		.head {
			background: #0099ff;
			color: white;
			display: flex;
			padding: 35upx 15px;

			&>view {
				&:first-of-type {
					width: 120upx;
					margin-right: 20upx;

					&>view {
						background-repeat: no-repeat;
						background-size: cover;
						background-position: top center;
						padding-top: 100%;
						border-radius: 50%;
					}
				}

				&:last-of-type {
					display: flex;
					flex-flow: column;
					flex-direction: column;
					justify-content: space-between;
					padding: 10upx 0;

					&>text {
						&.name {
							font-size: 26upx;
						}

						&.id {
							background: white;
							border-radius: 15upx;
							color: #0099ff;
							font-size: 22upx;
							padding: 5upx 20upx;
						}
					}
				}
			}
		}

		.list {
			margin: 20upx 0;

			&>view {
				padding: 0 15upx;
				display: flex;
				justify-content: space-between;

				&>navigator,
				&>view {
					background-color: white;
					border-radius: 10px;
					margin: 0 20upx 15upx;
					padding: 25upx 15upx;
					display: flex;
					position: relative;
					flex: 1;
					flex-flow: column;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 26upx;

					&>text {
						&:last-of-type {
							font-size: 22upx;
							margin-top: 15upx;
						}
					}

					&>view {
						width: 50%;
						padding-top: 50%;
						background-repeat: no-repeat;
						background-size: contain;
						background-position: center center;

						&.myTeam {
							background-image: url("https://admin.sinlu.net/weixinpl/shopping-temp/images/myTeam.png");
						}

						&.myCode {
							background-image: url("https://admin.sinlu.net/weixinpl/shopping-temp/images/myCode.png");
						}

						&.myYield {
							background-image: url("https://admin.sinlu.net/weixinpl/shopping-temp/images/myYield.png");
						}
					}

					&:nth-of-type(n + 1) {
						margin-left: 0;
					}
				}
			}
		}
	}
</style>
