<template>
	<view>
		<view class='showcase-two' :style="{marginTop:data.margin+'px',marginBottom:data.margin2+'px'}">
			<view class='img' v-for="(item,index) in data.img_list" :key="index">
				<image :src='item.url' style='width:100%;height:100%'  @click="$LinkTo(item)"></image>
			</view>
        </view>
	</view>
</template>

<script>
	export default {
		name:"showcase_two",
		props:{
			data:{
				type:Object,
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
.showcase-two {
    padding: 16upx 0;
    display: flex;
    justify-content: space-between;
	.img {
		width: 373upx;
		height: 270upx;
	}
}
</style>
