<template>
<view class='display' :style="{ marginTop: data.margin + 'px', marginBottom: data.margin2 + 'px' }">
    <view class='cont'  @click="$LinkTo(data)">
        <view class='img'>
            <image :src="data.img.url" class="image"></image>
        </view>
        <view class='describe'>
            <text class="text">{{data.activity}}</text>
            <text class="text">{{data.title}}</text>
        </view>
    </view>
</view>
</template>

<script>
export default {
	name: 'displaycard',
	props: {
		data: {
			type: Object,
			required: true
		}
	}
}
</script>

<style lang="less" scoped>
.display {
    padding: 15upx;
    background-color: #fff;
    position: relative;
	.cont {
		width: 100%;
		border-radius: 3px;
		box-shadow: 0 5px 5px #ccc;
		overflow: hidden;
		.img {
			width: 100%;
			height: 400upx;
			background-color: #eee;
			.image {
				width:100%;
				height:100%
			}
		}
		.describe {
			padding: 0 15upx;
			font-size: 28upx;
			height: 90upx;
			display: flex;
			align-items: center;
			justify-content: center;
			.text {
				&:nth-child(1) {
					padding: 1px 5px;
					background-color: rgb(233, 119, 42);
					color: #fff;
					font-size: 26upx;
					border-radius: 3px;
				}
				&:nth-child(2) {
					font-size: 32upx;
					color: #222;
					letter-spacing: 1px;
					margin-left: 5px;
				}
			}
		}	
	}
	.detail {
		position: absolute;
		bottom: 15upx;
		right: 30upx;
		background-color: #c33;
		color: #fff;
		font-size: 24upx;
		padding: 4px 10px;
	}
}
</style>
