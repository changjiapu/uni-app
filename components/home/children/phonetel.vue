<template>
<view class='phone_tel' :style="{ marginTop: data.margin + 'px', marginBottom: data.margin2 + 10 + 'px' }">
    <view class="img"></view>
	<!-- <image src='/images/phone_tel2.png' style='height:45upx;width:40upx'></image> -->
    <text class="text">{{data.placeholder}}{{data.haoma}}</text>
</view>
</template>

<script>
export default {
	name: 'phonetel',
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
 .phone_tel{
     display: flex;
     border-top: 1px solid #eee;
	 border-bottom: 1px solid #eee;
     padding: 10px 15px;
	 .img {
		height:45upx;
		width:40upx;
		background-repeat: no-repeat;
		background-position: center center;
		background-size: 100% 100%;
		background-image: url("@{URL}/weixinpl/shopping-temp/images/phone_.png");
	 }
	 .text {
		 font-size: 26upx;
		 margin-left: 10px;
	 }
 }

</style>
