<template>
	<view>
		<view :class="['product-list', data.style.active]" :style="{marginTop:data.margin+'px',marginBottom:data.margin2+'px'}">
			<!-- 样式一 -->
			<block v-if="data.style.active=='style-1'">
				<view :class="['product-list-item', {single: index % 2 == 1}]" v-for="(item,index) in data.img_list" :key="index"
				 @click="$LinkTo(item)" :style="{width:data.margin3*2+60+'rpx'}">
					<view class='img' :style="{width:data.margin4*2+70+'rpx',paddingLeft:data.margin5+'px'}">
						<image :src='item.url' style='width:100%;height:100%'></image>
					</view>
					<view class='msg'>
						<view class='product-name ellipsis'>{{item.name}}</view>
						<view class='product-advantage '>{{item.advantage}}</view>
						<view class='product-now-price '>{{item.now_price}}元</view>
					</view>
				</view>
			</block>
			<!-- 样式2 -->
			<block v-if="data.style.active=='style-2'">
				<view :class="['product-list-item', {single: index % 2 == 1}]" v-for="(item,index) in data.img_list" :key="index"
				 @click="$LinkTo(item)" :style="{width:data.margin3*2+70+'rpx'}">
					<view class='img' :style="{width:data.margin4*2+70+'rpx',paddingLeft:data.margin5+'px'}">
						<image :src='item.url' style='width:100%;height:100%'></image>
					</view>
					<view class='msg'>
						<view class='product-name ellipsis'>{{item.name}}</view>
						<view class='product-price'>
							<text class='now-price'>现价:￥{{item.now_price}}</text>
							<text class='need-score'>已售:{{item.saled}}</text>
						</view>
						<view class='product-orgin-price'>原价:￥{{item.orgin_price}}</view>
					</view>
				</view>
			</block>
			<!-- 大图样式 -->
			<block v-if="data.style.active=='style-3'">
				<view :class="['product-list-item', {single: index % 2 == 1}]" v-for="(item,index) in data.img_list" :key="index"
				 @click="$LinkTo(item)" :style="{width:data.margin3*2+125+'rpx'}">
					<view class='img' :style="{width:data.margin4*2+125+'rpx',paddingLeft:data.margin5+'px'}">
						<image :src='item.url' style='width:100%;height:100%'></image>
					</view>
					<view class='msg'>
						<view v-if="data.style2.active=='style-1'" class='product-advantage '>特卖</view>
						<view v-else class='product-advantage '>秒杀</view>
						<view class='product-name ellipsis2'>{{item.name}}</view>
						<view class='product-now-price '>{{item.now_price}}元</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		name: "product-list",
		props: {
			data: {
				type: Object,
				required: true
			}
		}
	}
</script>

<style lang="less">
	.product-list {
		background-color: #fff;
		display: flex;
		flex-wrap: wrap;

		&.style-1 {
			.product-list-item {
				margin: 3px 4px;
				padding: 1px;
				border: 1px solid #f3f3f3;

				&.single {
					margin-left: 6rpx;
				}

				.img {
					height: 370rpx;
				}

				.msg {
					padding: 25rpx 30rpx;

					.product-name {
						font-size: 22rpx;
						color: #333;
					}

					.product-advantage {
						font-size: 24rpx;
						color: #888;
						margin-top: 3px;
					}

					.product-now-price {
						font-size: 34rpx;
						color: #f01b1b;
						margin-top: 3px;

					}
				}
			}
		}

		&.style-2 {
			.product-list-item {
				width: 375rpx;
				box-sizing: border-box;
				padding: 15rpx 20rpx;

				&.single {
					border-right: none;
				}

				.img {
					width: 335rpx;
					height: 335rpx;
				}

				.msg {
					.product-name {
						
						font-size: 32rpx;
						text-align: left;
					}

					.product-price {
						display: flex;
						justify-content: space-between;
						font-size: 24rpx;
						color: #888;

						.now-price {
							line-height: 32rpx;
							padding: 0 8px;
							background-color: #f66;
							border-radius: 16rpx;
							color: #fff;
						}
					}

					.product-orgin-price {
						font-size: 24rpx;
						color: #888;
						text-decoration: line-through;
						margin-top: 4px;

					}
				}
			}

		}

		&.style-3 {
			.product-list-item {
				margin: 3px 4px;
				padding: 1px;

				&.single {
					margin-left: 6rpx;
				}

				.img {
					height: 370rpx;
				}

				.msg {
					display: flex;

					.product-advantage {
						height: 55rpx;
						width: 90rpx;
						text-align: center;
						line-height: 55rpx;
						margin: auto;
						background-color: #fd3f3e;
						color: #fff;
					}

					.product-name {
						margin-left: 10rpx;
						height: 85rpx;
						line-height: 85rpx;
						width: 65%;

						&.ellipsis2 {
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}
					}

					.product-now-price {
						margin-left: 10rpx;
						height: 85rpx;
						font-size: 40rpx;
						line-height: 85rpx;
						color: #fd3f3e;
					}
				}
			}
		}

		.ellipsis {
			color: #323232;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;

		}
	}
</style>
