<template>
<view class='slide-nav' :style="{marginTop: data.margin + 'px',marginBottom: data.margin2 + 'px'}">
	<scroll-view class='scroll-view' scroll-x>
		<view class='list-item' v-for="(item, index) in data.img_list" :key="index">
			<image :src='item.url' class="img"></image>
			<view class='text' :style="{ color: item.color }">{{item.nav_name}}</view>
		</view>
	</scroll-view>
</view>
</template>

<script>
	export default {
		name: 'slideNav',
		props: {
			data: {
				type: Object,
				required: true
			}
		}
	}
</script>

<style lang="less" scoped>
.slide-nav {
    background-color: #fff;
	.title {
		text-align: center;
		height: 75upx;
		line-height: 75upx;
	}
	.scroll-view {
		height: 240upx;
		white-space: nowrap;
		.list-item {
			display: inline-block;
			margin-right: 15upx;
			.img {
				width: 180upx;
				height: 180upx;
				display: block;
				
			}
			.text {
				line-height: 60upx;
				text-align: center;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 26upx;
			}
		}
		
	}
}
</style>
