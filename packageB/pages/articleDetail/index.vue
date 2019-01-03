<template>
	<view class="artdetail">
		 <view class="title">
			 <view class="txt">{{ detail.title }}</view>
			 <view class="control">
<!-- 				 <view class="box">
					 <view class="collect"></view>
					 <text></text>
				 </view>
				 <view class="box">
					 <view class="comment"></view>
					 <text></text>
				 </view> -->
			 </view>
		 </view>
		 <view class="srx">
			 <scroll-view scroll-y class="src">
			 	<view class="content"><rich-text :nodes="detail.content_a"></rich-text></view>
			 </scroll-view>
		 </view>
	</view>
</template>

<script>
	import { articleDetail } from '@/common/api/packageB'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				detail: {},
				params: {}
			};
		},
		onLoad(opt) {
			this.params.type = 1
			this.params.pid = opt.pid
			this.params.user_id = this.userInfo.id
			this.getInfo()
		},
		methods: {
			getInfo () {
				uni.showLoading()
				articleDetail(this.params).then(res => {
					uni.hideLoading()
					if (res && !res.data.code) {
						this.detail = res.data.data
					} else {
						uni.showToast({
							title: '获取数据失败!',
							icon: 'none'
						})
					}
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
@import '../../../common/css/variables.less'; 	
uni-page-body, page { height: 100%;}	
.artdetail {
	height: 100%;
	display: flex;
	flex-flow: column;
	flex-direction: column;
	.title {
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 15px;
		border-bottom: 1px solid #f3f3f3;
		.txt {
			font-size: 36upx;
			font-weight: bold;
			color: #607D8B;
			background: url("@{URL}/weixinpl/shopping-temp/images/share_t.png") no-repeat left center / 19px 19px;
			padding-left: 58upx;
		}
		.control {
			display: flex;
			align-items: center;
			.box {
				display: flex;
				margin-right: 20upx;
				font-size: 32upx;
				align-items: center;
				color:#878088;
				&:last-of-type { margin: 0; }
				.collect {
					width: 40upx;
					height: 40upx;
					border-radius: 50%;
					border: 1px solid #EA6F5A;
					background: url("@{URL}/weixinpl/shopping-temp/images/step.png") no-repeat;
					background-position: left;
					background-size: auto 100%;
					margin-right: 10upx;
					&.act {
						background-color: #EA6F5A;
						background-position: right;
						transition: background .6s steps(19);
					}
				}
				.comment {
					width: 55upx;
					height: 55upx;
					background: url("@{URL}/weixinpl/shopping-temp/images/review.png") no-repeat center center/contain;
				}
			}
		}		
	}
	.srx {
		flex: 1;
		overflow: hidden;
		.src {
			height: 100%;
			.content {
				margin: 10px 15px;
			}
		}
	}
}
</style>
