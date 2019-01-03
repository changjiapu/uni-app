<template>
	<view>
		<view class='search-with-location' :style="{marginTop:data.margin+'px',marginBottom:data.margin2+'px'}">
			<navigator class='location'>
			</navigator>
			<navigator class='search' url='/pages/productList/index'>
			<uni-icon  type="search" size="20" ></uni-icon>
				<text class='dsc'>{{data.placeholder||'搜索'}}</text>
			</navigator>
			<view class='classify'>
				<image class="img" :src="baseURL+'/weixinpl/shopping-temp/images/classify.png'"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcon from "@/components/uni-icon.vue"
	import { baseURL } from '@/common/utils/config'

	export default {
		name: "searchwithlocation",
		components: {
			uniIcon
		},
		props: {
			data: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				city: '东莞市',
				baseURL: baseURL
			};
		},
		onLoad() {

		},
		methods: {}
	}
</script>

<style lang="less" scoped>
.search-with-location {
	height: 80upx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: #333;
	padding: 0 15px;
	.location {
		display: flex;
		align-items: center;
		.text { font-size: 28upx; }
		.img {
			height: 40upx;
			width: 40upx
		}
	}
	.search {
		width: 550upx;
		height: 60upx;
		border-radius: 50upx;
		border: 1px solid #ccc;
		display: flex;
		align-items: center;
		justify-content: center;
	    .dsc {
			color: #888888;
			font-size: 28upx;
		}
	}
	.classify {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		.img {
			height: 50upx;
			width: 50upx
		}
	}
}
</style>
