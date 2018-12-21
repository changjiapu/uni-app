<template>
<view class='cross_skid'>
    <view class='title' v-if="data.is_show_title">{{data.title}}</view>
    <scroll-view class='srcoll-view' scroll-x>
        <view class='list_item' v-for="(item, index) in data.img_list" :key="index"  @click="$LinkTo(item)">
            <view class='msg'>
                <image :src='item.url' class="img"></image>
                <text class="text" v-if="data.is_show_name">{{item.name}}</text>
                <text class="text" v-if="data.is_show_price">￥{{item.now_price}}</text>
                <text class="text" v-if="data.is_show_sales_volume">销量：{{item.saled}}件</text>
            </view>
        </view>
    </scroll-view>
</view>
</template>

<script>
	export default {
		name: 'cross',
		props: {
			data: {
				type: Object,
				required: true
			}
		}
	}
</script>

<style lang="less" scoped>
@import '../../../common/css/variables.less'; 	
.cross_skid {
	.title {
		padding: 0 15px;
		height: 44px;
		font-size: 17px;
		line-height: 44px;
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center center;
		background-image: url("@{URL}/weixinpl/shopping-temp/images/cut.png");
		text-align: center;
	}
	.srcoll-view {
		white-space: nowrap;
	}
	.list_item {
		width: 220upx;
		display: inline-block;
		margin-left: 20upx;
		border: 1px solid #eee;
		.msg {
			display: flex;
			flex-direction: column;
			.img {
				width: 220upx;
				height: 200upx;
			}
			.text {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				font-size: 26upx;
				padding: 2px 10px;
				color: #888;
				&:nth-child(3) {
					color: coral
				}
			}
		}
	}
}
</style>
