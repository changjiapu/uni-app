<template>
<view class='map_posit' :style="{ marginTop: data.margin + 'px', marginBottom: data.margin2 + 'px' }">
    <view class='map'>
        <view class='address'>
            <view class="icon"></view>
            <text class="text">{{ data.placeholder }}</text>
        </view>
    </view>
</view>
</template>

<script>
	export default {
		name: 'manposit',
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
.map{
	margin: 0 15px;
	.address {
		display:flex;
		align-items: center;
		font-size: 16px;
		padding: 15upx 0;
		.icon {
			height:35upx;
			width:35upx;
			margin-right: 10px;
			background-repeat: no-repeat;
			background-position: center center;
			background-size: 100% 100%;
			background-image: url("@{URL}/weixinpl/shopping-temp/images/address_b.png");
		}
		.text {
			font-size: 26upx;
		}
	}
}
</style>
