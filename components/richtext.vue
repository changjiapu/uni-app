<template>
	<view class="alertRich">
		<view class="statusbar"></view>
		<view class="dailog">
			<rich-text :nodes="data"></rich-text>
			<view class="close" @click="$emit('on-close')"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			data: [String]
		}
	}
</script>

<style lang="less">
@import '../common/css/variables.less'; 	
.alertRich, .alertRich > view.statusbar {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;		
}	
.alertRich{
	z-index: 999;
	& > view {
		&.statusbar {
			background:rgba(0,0,0,.5);
		}
		&.dailog {
			background:white;
			position: absolute;
			top: 40upx;
			border-radius: 20upx;
			padding: 15upx;
			left: 40upx;
			bottom: 140upx;
			right: 40upx;
			& > .close {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: -80upx;
				width: 60upx;
				height: 60upx;
				background:url("@{URL}/weixinpl/shopping-temp/images/close_w.png") no-repeat center center/contain
			}
		}
	}
}

</style>
