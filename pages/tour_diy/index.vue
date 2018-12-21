<template>
<view class="tourDiy">
	<view class="search">
	  <input placeholder="关键字搜索" v-model="params.search" />
	</view>
	<view class="tabs">
	  <view v-for="(item, index) in tabs" @click="select(index)" :class="{active: index === currentTab}" :key="index">{{ item }}</view>
	</view>
	<view class="list">
		<view v-for="(item, index) in list" :key="index">
			<view class="item">
				<view class="cover">
					<view :class="{ordianry: item.type === 1, spike: item.type === 3, luck: item.type === 2, super: item.type === 4}" :style="{backgroundImage: 'url('+ baseURL +item.default_imgurl+')' }"></view>
				</view>
				<view class="dsc">
					<view class="title">
						<text>{{item.name}}</text>
					</view>
					<view class="price">
						<text class="size">{{item.price}}元/人</text>
						<text class="group">{{item.group_size}}人团</text>
					</view>
					<navigator hover-class="none" class="btn" :url="'/pages/product_detail/product_detail?pid='+item.pid+'&group=1'">去开团</navigator>
				</view>
			</view>
			<view class="excess" v-if="item.start_time || item.start_t">
				<view>
					<block v-if="[1,0].includes(item.type)">商品拼团</block>
					<block v-if="item.type === 3">秒杀拼团</block>
					<block v-if="item.type === 2">抽奖拼团</block>
					<block v-if="item.type === 4">超级拼团</block>
				</view>
				<block v-if="item.start_t">
					<view>{{ item.start_t }}</view>
				</block>
				<block v-else>
					<view>{{ item.start_time }}<text class="separate">至</text>{{ item.end_time }}</view>
				</block>
			</view>
		</view>
	</view>
</view>
</template>

<script>
import { collageProduct } from '@/common/api'
import { baseURL } from '@/common/utils/config'
export default {
	name: 'tourdiy',
	data() {
		return {
			baseURL: baseURL,
			currentTab: 0,
			product: [],
			tabs: ['全部', '普通团', '抽奖团', '秒杀团', '超级团'],
			params: {
				group_type: 1,
				type: 0,
				search: ''
			}
		}
	},
	onLoad () {
		this.getList()
	},
	methods:{
		getList(type) {
			if (type !== undefined) this.params.type = type
			collageProduct(this.params).then(res => {
				if (!res.data.code) this.product = res.data.data
			})
		},
		select(idx) {
			this.currentTab = idx
			this.getList(idx)
		}
	},
	computed: {
		list () {
			return this.product.filter(item => item.name.toLowerCase().indexOf(this.params.search) >= 0)
		}
	}
}
</script>

<style lang="less">
@import '../../common/css/variables.less'; 	
.tourDiy {
	.search{
		left: 0;
		top: 0;
		z-index: 999;
		margin: 0;
		background-color: #e3e3e3;
		padding: 15upx 20upx;
		input {
			text-align: center;
			font-size: 28upx;
			padding:8upx 15upx;
			background:white;
			border-radius: 10upx;
			&:focus {
				text-align: left;
			}
		}
	}
	.tabs {
		display: flex;
		view {
			flex: 1;
			text-align: center;
			padding: 20upx 0;
			font-size: 26upx;
			&.active {
				color: #FF6633;
				border-bottom: 6rpx solid #FF6633;
			}
		}
	}
	.list {
		margin: 15upx 0 0 0;
		& > view {
			position: relative;
			padding-bottom: 20upx;
			margin-bottom: 20upx;
			&::after {
				position: absolute;
				content: '';
				border-top:1px dashed #f3f3f3;
				width: 100%;
				left: 0;
				bottom: 0;
			}
			&:last-of-type {
				&::after {
					display: none;
				}
			}
			.item {
				display: flex;
				.cover {
					width: 200upx;
					margin: 0 20upx 0 0;
					view {
						width: 100%;
						padding-top: 100%;
						background-size:cover;
						background-repeat: no-repeat;
						background-position: top center;
						position: relative;
						&::after {
							position: absolute;
							content: '';
							top: 5px;
							left: 5px;
							width: 80upx;
							height: 40upx;
							background-repeat: no-repeat;
							background-size:contain;
							background-position: center center;
						}
						&.ordianry {
							&::after {
								background-image: url("@{URL}/weixinpl/shopping-temp/images/icon17.png");
							}
						}
						&.spike {
							&::after {
								background-image: url("@{URL}/weixinpl/shopping-temp/images/icon14.png");
							}
						}
						&.luck {
							&::after {
								background-image: url("@{URL}/weixinpl/shopping-temp/images/icon15.png");
							}
						}
						&.super {
							&::after {
								background-image: url("@{URL}/weixinpl/shopping-temp/images/icon16.png");
							}
						}
					}
				}
				.dsc {
					flex: 1;
					position: relative;
					.title {
						font-size: 28upx;
						display: -webkit-box;    
						-webkit-box-orient: vertical;    
						-webkit-line-clamp: 2;    
						overflow: hidden;
						margin: 15upx 20upx 15upx 0
					}
					.price {
						font-size: 26upx;
						color:red;
						.size {
							margin-right: 20upx;
						}
						.group {
							color: #a5a5a5
						}
					}
					.btn {
						color:white;
						background: #E91E63;
						font-size: 12px;
						padding: 5px 10px;
						border-radius: 5px;
						position: absolute;
						right: 15px;
						top: 50%;
						transform: translateY(-20%);
					}
				}
			}
			.excess {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 15px;
				font-size: 22upx;
				background:#fff0e6;
				color:#222;
				padding: 15upx 30upx;
				margin: 10upx 0 0 0;
				& > view {
					&:first-of-type {
					}
				}
				.separate {
					padding: 0 15upx;
				}
			}
		}
	}
}
</style>
