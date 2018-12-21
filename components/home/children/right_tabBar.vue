<template>
<view class='tabBar'>
    <view class='bt1'>
        <button class='bt3' open-type="contact">
            <image class="img" :src="baseURL+'/weixinpl/shopping-temp/images/zxKF.png'"></image>
        </button>
    </view>
    <view class='bt2'  bindtap='call_phone'>
        <image class="img" :src="baseURL+'/weixinpl/shopping-temp/images/phone_2.png'"></image>
    </view>
</view>
</template>

<script>
	import { baseURL } from '@/common/utils/config'

	export default {
		data () {
			return {
				baseURL: baseURL
			}
		}
	}
</script>

<style lang="less" scoped>
.tabBar {
    width: 80upx;
    font-size: 20upx;
    color: #fff;
    position: fixed;
    bottom: 180upx;
    right: 10upx;
    z-index: 1;
	.bt1 {
	    height: 80upx;
	    background-color: rgba(0, 0, 0, 0.5);
	    display: flex;
	    flex-direction: column;
	    justify-content: center;
	    align-items: center;
	    margin-bottom:5upx;
	    border-radius: 2px;
		.bt3 {
		    width: 90upx;
		    background-color: rgba(0, 0, 0, 0);
		    display: flex;
		    flex-direction: column;
		    justify-content: center;
		    align-items: center;
			.img {
				height: 60upx;
				width: 60upx;
			}
		}
		
	}
	.bt2 {
	    height: 80upx;
	    background-color: rgba(0, 0, 0, 0.5);
	    display: flex;
	    justify-content: center;
	    align-items: center;
	    border-radius: 2px;
		.img {
			height: 40upx;
			width: 40upx;
		}
	}
}
</style>
