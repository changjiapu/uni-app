<template>
	<view class="pckageDetail">
		 <view v-if="list.length">
			<swiper class="imgList" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item v-for="(item, index) in list" :key="index" class="list">
					<image :src="item" mode="scaleToFill"></image>
				</swiper-item>
			</swiper>
			<view class="desc">
				<view class="title">
					{{ Info.package_name }}
				</view>
				<view class="price">
					<view>
						<text class="now">&yen;{{ Info.price }}</text>
						<text class="old">&yen;{{ Info.cost_price }}</text>
					</view>
					<view>库存{{ Info.stock }}</view>
				</view>
			</view>
			<view class="info">
				<view class="title">礼包详情</view>
				<view class="com">
					<rich-text :nodes="Info.description"></rich-text>
				</view>
			</view>
			<view class="btn" @click="Buy">{{ Info.buy }}</view>
		 </view>
	</view>
</template>

<script>
	import { packageDetail } from '@/common/api/packageA'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				Info: {},
				list: [],
				indicatorDots: false,
				autoplay: false,
				interval: 5000,
				duration: 1000,
				package_id:''
			};
		},
		onLoad(opt) {
		    this.package_id=opt.id
			this.getDetails(opt)
			
		},
		methods: {
			getDetails(params) {
				const package_id = params.id
				packageDetail({ package_id, user_id: this.userInfo.id }).then(res => {
					if (!res.data.code) {
						this.Info = res.data.data
						this.list = res.data.data.img_arr
					}
				})
			},
			Buy(){
				let package_id=this.package_id
				this.$gotoLogin().then(res=>{
					if(res){
						uni.navigateTo({
							url:'/packageA/pages/createOrder/createOrder?package_id='+package_id,
							
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
.pckageDetail {
	.imgList {
		height: 500upx;
		.list {
			& > image {
				width: 100%;
				height: 100%;
			}
		}
	}
	.desc {
		padding: 0 15px;
		.title, .price {
			display: flex;
		}
		.title {
			height: 80upx;
			line-height: 80upx;
			font-size: 30upx;
			background:url("@{URL}/weixinpl/shopping-temp/images/package.png") no-repeat left center/40upx 40upx;
			box-sizing: border-box;
			border-bottom: 1px solid #f6f6f6;
			padding-left: 50upx;
		}
		.price {
			justify-content: space-between;
			align-items: center;
			padding: 15upx 0;
			& > view {
				& > text {
					&.now {
						color:red;
					}
					&.old {
						font-size: 22upx;
						padding-left: 20upx;
						color:#afafaf;
						text-decoration: line-through;
					}
				}
				&:nth-of-type(2) {
					color:#afafaf
				}
			}
		}
	}
	.info {
		.title {
			height: 80upx;
			line-height: 80upx;
			text-align: center;
			font-size: 26upx;
			background:#d2d2d2
		}
		.com {
			padding-bottom: 100upx;
		}
	}
	.btn {
		height: 80upx;
		line-height: 80upx;
		background-color:#4a4a4a;
		color:white;
		text-align: center;
		position: fixed;
		width: 100%;
		left: 0;
		bottom: 0;
		font-size: 28upx;
	}

}
</style>
