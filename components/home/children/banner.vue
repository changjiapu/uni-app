<template>
	<view>
		 <swiper class="swiper" indicator-color="#eee" indicator-active-color="#0099FF" indicator-dots="true" autoplay="true" interval="4000" duration="500" circular="true" :style="{marginTop: 'data.margin + px',marginBottom: 'data.margin2 + px'}">
				<swiper-item class="swiper-item" v-for="(item,index) in data.img_list" :key="index" @click="$LinkTo(item)">
					<image class="img" :src="item.url"></image>
				</swiper-item>
      </swiper>
	</view>
</template>

<script>
	export default {
	name: "banner",
	props: {
		data: {
			type: Object,
			required: true
		}
	}
	}
</script>

<style lang="less" scoped>
.swiper{
    width: 100%;
    height: 375upx;
	.img {
		width: 100%;
		height: 100%;
	}
}

</style>
