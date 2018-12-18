<template>
	<view>
		<view class='head'>物流信息</view>
		<block v-if="data.length">
			<view class='item' v-for="(item,index) in data" :key='index'>
				<view class='left'>{{item.time}}</view>
				<view class='right'>{{item.context}}</view>
				<view class='dit'>
					<view class='dit2'></view>
				</view>
			</view>
		</block>
		<empty-data v-else>还没有物流信息</empty-data>
	</view>
</template>

<script>
	import {
		expressData
	} from '@/common/api/packageB.js'
	export default {
		data() {
			return {
				data: []
			};
		},
		onLoad(options) {
			var postid = options.expressnum,
				expressname = options.send_express_name;
			var sendData = {
				postid,
				expressname

			}
			expressData(sendData).then(res => {
				if (res.data.data.length != 0) {
					this.data = res.data.data
				} else {
					uni.showModal({
						content:res.data.message,
						showCancel:false
					})
				}
			})
		}
	}
</script>

<style scoped>
	page{
		background-color: #fff;
		color: #999;
	}
	.head {
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		color: #000
	}

	.item {
		position: relative;
		display: flex;
		height: 170rpx;
	}

	.item .left {
		padding-left: 20rpx;
		border-right: 1px solid #ddd;
		height: 170rpx;
		min-width: 200rpx;
		max-width: 200rpx;
		width: 200rpx;
		display: flex;
		align-items: center;
	}

	.item .right {
		margin-left: 20rpx;
		height: 170rpx;
		display: flex;
		align-items: center;
	}

	.item .dit {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 75rpx;
		left: 200rpx;
		height: 35rpx;
		width: 35rpx;
		border: 1px solid #ddd;
		border-radius: 100%;
	}

	.item .dit .dit2 {
		height: 25rpx;
		width: 25rpx;
		background-color: #ddd;
		border-radius: 100%;
	}

	.item:nth-child(2) {
		color: orange;
	}

	.item:nth-child(2) .dit .dit2 {
		background-color: orange;
	}
</style>
