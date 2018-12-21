<template>
	<view class="empty">
		<view>
			<view><view></view></view>
			<text><slot>这里空空如也</slot></text>
		</view>
	</view>
</template>

<script>
	export default {
	}
</script>

<style lang="less">
	@import '../common/css/variables.less';
	.empty {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		& > view {
			position: absolute;
			top: 50%;
			left:50%;
			transform: translate3d(-50%,-50%,0);
			& > view {
				width: 220upx;
				margin: 0 auto;
				& > view {
					width: 100%;
					padding-top: 100%;
					background-repeat: no-repeat;
					background-size: contain;
					background-position: center center;
					background-image: url("@{URL}/weixinpl/shopping-temp/images/noOrder.png");
				}
			}
			& > text {
				padding: 15upx 0;
				font-size: 30upx;
				color:#333;
				white-space: nowrap;
				position: relative;
				display: block;
				left: 50%;
				transform: translateX(-50%);
				text-align: center;
			}
		}
	}
</style>
