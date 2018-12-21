<template>
	<view>
		<view class="tabar" :style="{backgroundColor:data.bottom_background}">
			<view class="tabar-item" v-for="(item,index) in data.nav_list" :key="index" :style="{width:100/data.nav_list.length+'%'}"
			 @click='currentPageChange(item)'>
				<image :hidden="pageKey!=item.page_key" :src="item.active_url" />
				<image :hidden="pageKey==item.page_key" :src="item.url" />
				<text :hidden="pageKey!=item.page_key" :style="{color:data.bottom_active_color}">{{item.title}}</text>
				<text :hidden="pageKey==item.page_key" :style="{color:data.bottom_color}">{{item.title}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { baseURL } from '@/common/utils/config'
	export default {
		name: 'tabBar',
		props: {
			data: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				pageKey:'home',
				nav_list:[
					{
						title:'首页',
						url:baseURL+'/public/upload/img/1538128943892.png',
						active_url:baseURL+'/public/upload/img/1538128956746.png',
						page_key:'home'
					}
				]
			};
		},
		methods: {
			currentPageChange(e) {
				let detail = {}
				detail.page_key = e.page_key;
				detail.text = e.title;
				this.pageKey=detail.page_key;
				this.$emit('currentPageChange',detail)
			}
		}
	}
</script>

<style scoped>
	.tabar {
		position: fixed;
		z-index: 1;
		bottom: 0;
		width: 100%;
		height: 100upx;
		background-color: #fff;
		display: flex;
		border-top: 1px solid #E4E7ED;
		box-sizing: border-box;
	}

	.tabar .tabar-item {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.tabar .tabar-item image {
		width: 40upx;
		height: 40upx;
	}

	.tabar .tabar-item text {
		font-size: 24upx;
		color: #8a8a8a;
		margin-top: 8upx;
	}
</style>
