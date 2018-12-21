<template>
<view class='brands' :style="{marginTop: data.margin + 'px', marginBottom: data.margin2 + 'px'}">
    <view class='title' v-if="data.is_show_title">{{data.title}}</view>
    <scroll-view class='scroll-view' scroll-x>
        <view class='list-item' v-for="(item, index) in data.img_list" :key="index"  @click="$LinkTo(item)">
            <image :src='item.url' class="img"></image>
        </view>
    </scroll-view>
</view>
</template>

<script>
export default {
	name: 'brands',
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
.brands {
    background-color: #fff;
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
	.scroll-view {
		height: 158upx;
		white-space: nowrap;
		.list-item {
			display: inline-block;
			margin: 0 14upx;
			.img {
				display: block;
				width: 165upx;
				height: 165upx;
			}
		}
	}
}
</style>
