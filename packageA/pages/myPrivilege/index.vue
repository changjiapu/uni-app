<template>
	<view class="priviliege">
		 <view class="head">
			 <view>
				 <view class="avatar" :style="{backgroundImage: 'url('+ list.weixin_headimgurl +')'}"></view>
				 <view class="name">{{ list.weixin_name }}</view>
				 <view class="level">
					 <view v-for="(card, index) in list.card" :key="index" :style="{backgroundImage: 'url('+ card.images +')'}">
					 {{ card.name }}
					 </view>
				 </view>
			 </view>
		 </view>
		 <view class="list">
			 <scroll-view scroll-y class="srx">
			 	<navigator :url="item.link" hover-class="none" class="item" v-for="(item, index) in list.condition" :key="index">
			 		<view>
			 			<view :style="{ backgroundImage: 'url('+ item.imgages +')'}"></view>
			 			<view>
			 			<text class="name">{{ item.name }}</text>
			 			<text class="desc">{{ item.condition }}</text>
			 			</view>
			 		</view>
			 	</navigator>
			 </scroll-view>
		 </view>
	</view>
</template>

<script>
	import { myPrivilege } from '@/common/api/packageA'
	import { mapState } from 'vuex'
	export default {
		name: 'myprivilege',
		data() {
			return {
				list: {}
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList () {
				myPrivilege({ user_id: this.userInfo.id || '' }).then(res => {
					if (!res.data.code) {
						res.data.data.condition.forEach(item => {
							if (+item.ptype === 1) {
								item.link = '/packageA/pages/distributor/index'
							} else if (+item.ptype === 3) {
								item.link = '/packageA/pages/apply/index'
							} else if (+item.ptype === 5) {
								item.link = '/packageA/pages/myShop/index'
							}
						})
						this.list = res.data.data
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
uni-page-body, page { height: 100%;}	
.priviliege {
	display: flex;
	flex-flow: column;
	flex-direction: column;
	height: 100%;
	.head {
		background-color:#0099ff;
		color:white;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40upx 0;
		& > view {
			text-align: center;
			.avatar {
				background-repeat: no-repeat;
				background-size: cover;
				background-position: top center;
				width: 150upx;
				height: 150upx;
				border-radius: 50%;
				margin: 0 auto;
			}
			.name {
				margin: 15upx 0;
				font-size: 30upx
			}
			.level {
				font-size: 26upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 22upx;
				& > view {
					background-repeat: no-repeat;
					background-size: contain;
					background-position: left center;
					padding-left: 45upx;
					margin-right: 25upx;
					&:last-of-type {
						margin-right: 0;
					}
				}
			}
		}
	}
	.list {
		flex: 1;
		overflow: hidden;
		.srx {
			height: 100%;
			overflow: hidden;
			padding: 15upx 0;
			box-sizing: border-box;
			.item {
				& > view {
					background-color:white;
					border-radius: 10px;
					margin: 0 20upx 15upx;
					padding: 15upx;
					display: flex;
					position: relative;
					align-items: center;
					position: relative;
					&::after {
						content: '';
						position: absolute;
						width: 15upx;
						height: 15upx;
						right: 20upx;
						top:50%;
						border-right:1px solid transparent;
						border-top: 1px solid transparent;
						border-color:#c7c7c7;
						transform: translateY(-50%) rotate(45deg);
					}
					& > view {
						&:first-of-type {
							background-repeat: no-repeat;
							background-size: contain;
							background-position: center center;
							width: 35upx;
							height: 35upx;
							margin-right: 30upx;
						}
						&:last-of-type {
							flex: 1;
							display: flex;
							flex-direction: column;
							flex-flow: column;
							justify-content: space-between;
							& > text {
								&.name { font-size: 30upx;padding-bottom: 15upx; }
								&.desc { font-size: 24upx;color:#999 }
							}
						}
					}
				}
			}
		}
	}
}	
</style>
