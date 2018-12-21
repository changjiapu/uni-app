<template>
<view class="notice">
	<view class="message">
		<image :src="baseURL+'/weixinpl/shopping-temp/images/notice.png'" class="img"></image>
		<text>公告:</text>
	</view>
    <view class="marquee_box">
		<view class="animate">
			<text :class="['txt', { show: scx }]" :style="ani" @transitionend="showX">{{ data.placeholder }}</text>
		</view>
    </view>
</view>
</template>

<script>
import { baseURL } from '@/common/utils/config'
export default {
	name: 'notice',
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			baseURL: baseURL,
			scx: false
		}
	},
	mounted () {
		setTimeout(() => {
			this.scx = true
		},100)
	},
	methods: {
		showX () {
			this.scx = false
			setTimeout(() => {
				this.scx = true
			}, 100)
		}
	},
	computed: {
		ani () {
			if (!this.scx) {
				return `transform: translate3d(100%,0,0)`
			} else {
				let w 
				//#ifdef H5
				w = -window.innerWidth + 90
				//#endif
				//#ifdef APP-PLUS
				w = -plus.screen.resolutionWidth + 90
				//#endif
				//#ifdef MP-WEIXIN
				w = -wx.getSystemInfoSync().windowWidth + 90
				//#endif
				return `transform: translate3d(${w}px,0,0)`
			}
		}
	}
}
</script>

<style lang="less" scoped>
.notice {
    overflow: hidden;
    display: flex;
    width: 100%;
    height: 60upx;
    line-height: 60upx;
    color: #fff;
    background-color: #F44336;
	font-size: 26upx;
	display: flex;
	.message {
	    padding-left: 10px;
		padding-right: 10px;
	    z-index: 1;
	    background-color: #F44336;
		box-shadow: 5px 0px 14px 0px #bb3b3b;
		width: 70px;
		.img {
			width: 38upx;
			height: 60%;
			vertical-align: middle;
			margin-right: 10upx;
		}
	}
	.marquee_box {
		flex: 1;
		position: relative;
		.animate {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			.txt {
				white-space: nowrap;
				position: absolute;
				right: 0;
				&.show {
					transition: all 12s linear;
				}
			}
		}
	}
}
</style>