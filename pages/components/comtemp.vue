<template>
<view class="collect">
	<view class="control">
		<view>共计{{ list.length }}条记录</view>
		<view :class="['edit',{ act: isEdit}]" @click="isEdit = !isEdit"></view>
	</view>
	<view class="list" v-if="list.length">
		<scroll-view scroll-y class="srx">
			<view class="item" v-for="(item, index) in list" :key="index">
				<view>
					<view :class="['delete', {act: isEdit}]" @click="$emit('on-del',item)"><view></view></view>
					<navigator :url="'/pages/product_detail/product_detail?pid='+item.id" hover-class="none" class="image" :style="{backgroundImage: item.default_imgurl ? 'url('+item.default_imgurl+')' : 'url(' + baseURL + '/weixinpl/shopping-temp/images/none.png)'}">
						<view></view>
					</navigator>
					<view class="dsc">
						<view class="info">
							<view class="title">
								{{ item.name }} {{ item.remarks }}
							</view>
							<view class="price">
								<text class="n">&yen;{{ item.now_price }}</text>
								<text class="o">&yen;{{ item.orgin_price }}</text>
							</view>
							<view class="btn">
								<view><navigator :url="'/pages/productList/index?typeid='+item.type_id || ''">查看相似</navigator></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
	<view class="no-data" v-if="noData && !list.length">
		<empty-data></empty-data>
	</view>
	
</view>
</template>

<script>
	import { baseURL } from '@/common/utils/config'
	export default {
		name: 'comtemp',
		props: {
			list: {
				type: Array,
				required: true
			},
			noData: {
				type: Boolean,
				required: true
			}
		},
		data() {
			return {
				baseURL: baseURL,
				isEdit: false
			};
		}
	}
</script>

<style lang="less" scoped>
@import '../../common/css/variables.less'; 
.collect {
	height: 100%;
	display: flex;
	flex-flow: column;
	flex-direction: column;
	.control {
		height: 80upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background:#f6f6f6;
		padding: 0 15px;
		font-size: 24upx;
		.edit {
			background: url("@{URL}/weixinpl/shopping-temp/images/edit.png") no-repeat center center/contain;
			width: 36upx;
			height: 36upx;
			transition: background .2s ease-in;
			&.act {
				background: url("@{URL}/weixinpl/shopping-temp/images/edit_complete.png") no-repeat center center/contain;
			}
		}
	}
	.list, .no-data{
		flex: 1;
		background-color:#efefef;
		overflow: hidden;
		.srx {
			height: 100%;
			padding: 20upx 0;
			box-sizing: border-box;
			.item {
				& > view {
					background-color:white;
					border-radius: 10px;
					margin: 0 20upx 15upx;
					padding: 15upx;
					display: flex;
					position: relative;
					.delete {
						position: absolute;
						width: 30upx;
						border-radius: 10px;
						padding: 15upx;
						right: 15upx;
						top: 15upx;
						background-color:#f44336;
						transition: transform .2s ease-in-out;
						transform: scale(0);
						&.act {
							transform: scale(1);
						}
						& > view {
							width: 100%;
							padding-top: 100%;
							background: url("@{URL}/weixinpl/shopping-temp/images/delete_white.png") no-repeat center center/contain;
						}
					}
					.image {
						width: 220upx;
						background-repeat: no-repeat;
						background-size: contain;
						background-position: center center;
						margin-right: 15upx;
						& > view {
							width: 100%;
							padding-top: 100%;
						}
					}
					.dsc {
						flex: 1;
						display: flex;
						align-items: center;
						.info {
							font-size: 26upx;
							.title {
								overflow : hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 2;
								-webkit-box-orient: vertical;
							}
							.price {
								margin: 20upx 0;
								.n {
									color:#E91E63;
									margin-right: 15upx;
								}
								.o {
									font-size: 22upx;
									color:#999
								}
							}
							.btn {
								display: flex;
								& > view {
									border:1px solid #0099ff;
									color:#0099ff;
									border-radius: 20upx;
									font-size: 22upx;
									padding: 10upx 25upx;
								}
							}
						}
					}
				}
			}
		}
	}
	.no-data {
		position: relative;
	}
}

</style>
