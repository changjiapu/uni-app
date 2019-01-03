<template>
	<view>
		<view class="sendstyle_pickup" v-for="(item,index) in store" :key='index' @click="onclickStore(item)">
			<view class="my_info">
				<image :src="baseURL+'/weixinpl/shopping-temp/images/store.png'"></image>
				<text decode="true">&nbsp;&nbsp;门店：{{item.name}}</text>
			</view>
			<view class="my_info">
				<image :src="baseURL+'/weixinpl/shopping-temp/images/address_a.png'"></image>
				<text decode="true">&nbsp;&nbsp;地址：{{item.address}}</text>
			</view>
		</view>
		<view class="tis" bindtap="onclickStore">
			<text v-if="!store">--------暂无数据-------</text>
			<text v-else>不选择门店</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		Private_store
	} from '@/common/api/index.js'
	import {
		baseURL
	} from '@/common/utils/config'
	export default {
		data() {
			return {
				store: [],
				baseURL: baseURL,
			};
		},
		onLoad() {
			Private_store({
				user_id: this.userInfo.id
			}).then(res => {
				if (!res.data.code) {
					this.store = res.data.data
				}
			})
		},
		methods: {
			onclickStore: function(e) {
				console.log(e)
				var storeId = e.id
				var storeName = e.name
				uni.setStorage({
					key: "select_store",
					data: {
						storeId: storeId,
						storeName: storeName
					}
				})
				uni.navigateBack({
					delta: 1
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

<style scoped>
	.sendstyle_pickup {
		width: 100%;
		background-color: white;
		padding-left: 10px;
		border-bottom: 1px solid #eee;
		text-overflow: ellipsis;
	}

	.my_info {
		margin-top: 10px;
		width: 90%;
		margin-bottom: 10px;
	}

	.my_info image {
		width: 25px;
		height: 25px;
		display: inline-block;
		vertical-align: middle;
	}

	.my_info text {
		margin-right: 2px;
		line-height: 28px;
		word-break: break-all;
		font-size: 15px;
		font-family: 微软雅黑;
		color: #8e8e8e;
		vertical-align: top;
		display: inline-block;
		width: 90%;
	}

	.tis {
		width: 100%;
		line-height: 60px;
		text-align: center;
		font-family: "微软雅黑";
		font-size: 26px;
		color: #ccc;
		margin-top: 2%;
		background-color: white;
	}
</style>
