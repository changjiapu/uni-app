<template>
<view class='audio_musie' :style="{ marginTop: data.margin + 'px', marginBottom: data.margin2 + 'px' }">
    <image class="img" :src=" isplayingMusic ? '/images/music-stop.png' : '/images/music-start.png'"></image>
    <text>{{data.placeholder}}</text>
</view>
</template>

<script>
	export default {
		name: 'audiomusie',
		props: {
			data: {
				type: Object,
				required: true
			}
		},
		data () {
			return {
				
			}
		}
	}
</script>

<style lang="less" scoped>
 .audio_musie{
     display: flex;
     align-items: center;
	 .img {
		 margin-right:20upx; 
		 margin-left: 20upx;
	     height: 30px;
	     width: 30px
	 }
 }
</style>
