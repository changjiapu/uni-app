<template>
	<view>
		<view class='qrCode' :style="{backgroundImage: 'url('+imgSrc+')'}" mode='aspectFill' @click='preImg(imgSrc)'>
		</view>
	</view>
</template>

<script>
	import {
		codePicture
	} from '@/common/api'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				imgSrc: ''
			};
		},
		onLoad() {
			uni.showLoading({})
			codePicture({
				user_id: this.userInfo.id
			}).then(res => {
				uni.hideToast()
				if (!res.data.code) {
					this.imgSrc = res.data.data
				}
			})
		},
		methods: {
			preImg(e) {
				wx.previewImage({
					urls: [this.imgSrc],
					current: e
				})
			},
		},
		computed: {
			...mapState([
				'userInfo'
			])
		}

	}
</script>

<style>
	.qrCode {
		width: 100%;
		height: 660px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		-moz-background-size: 100% 100%;
	}
</style>
