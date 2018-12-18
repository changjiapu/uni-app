<template>
	<view>
		<view :class="['showcase-three',data.style.active]" :style="{marginTop:data.margin+'px',marginBottom:data.margin2+'px'}">
			<view class='img' v-for="(item,index) in data.img_list" :key='index'>
				<image :src='item.url' style='width:100%;height:100%' @click="$LinkTo(item)"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "showcase_three",
		props: {
			data: {
				type: Object,
				required: true

			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="less" scoped>
.showcase-three{
	&.style-1 {
	 width: 100%;
	 height: 750upx;
		 .img {
			 width: 50%;
			 float: left;
			 &:nth-child(1) {
				 height: 750upx;
			 }
			 &:nth-child(2) {
				 height: 375upx;
			 }
			 &:nth-child(3) {
				 height: 375upx;
			 }
		 }
	}
	&.style-2 {
		width: 100%;
		display: flex;
		justify-content: space-between;
		.img {
			width: 245upx;
			height: 180upx;
		}
	}
}

</style>
