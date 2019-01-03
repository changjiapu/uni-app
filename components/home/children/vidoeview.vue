<template>
<video :src="url" class="video" :poster='data.img.url'></video>
</template>

<script>
	import { getVideo } from '@/common/api'
	export default {
		name: 'vidwoview',
		props: {
			data: {
				type: Object,
				required: true
			}
		},
		data () {
			return {
				vid: '',
				url: ''
			}
		},
		methods: {
			VideoDetail () {
				getVideo(this.vid).then(res => {
					console.log(res)
				})
				let vid = this.vid
				 //通过以下接口拿到视频的详细参数 通过正则拼装成一个可以在小程序中使用的URl
				uni.request({
					url: "https://vv.video.qq.com/getinfo?vid="+ vid+ "&platform=101001&charge=0&otype=json",
					method: 'get',
					success: (res)=> {
						var dataJson = res.data.replace(/QZOutputJson=/, '') + "qwe";
						var dataJson1 = dataJson.replace(/;qwe/, '');
						var data = JSON.parse(dataJson1);
						var url = data.vl.vi[0].ul.ui[0].url
						var url2 = url.replace(/http/, "https"); //把'http'替换为https
						var fu = data.vl.vi[0].fn
						var fvkey = data.vl.vi[0].fvkey
						var a = url2 + fu + '?vkey=' + fvkey
						console.log(a)
						this.url = a
					}
				})					
			}
		}
	}
</script>

<style lang="less" scoped>
.video {
	width:100%;
	display: block;
	z-index: 1;
}
</style>
