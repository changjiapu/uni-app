<template>
	<view>
		<view class='search'>
			<input type='text' confirm-type="search" @confirm="search" placeholder='请输入关键字'></input>
		</view>
		<scroll-view scroll-x="true" class="groups-x">
			<view v-if="dianpuleibie==5" v-for="(item,index) in groups" :key="index" :class="{active:currentIndex==index}"
			 @click="changTab(index)">{{item.name}}</view>
			<view v-if="dianpuleibie==1||dianpuleibie==2" v-for="(item,index) in groups" :key="index" :class="{active:currentIndex==index}"
			 bindtap="changTab(index)">{{item.shop_name}}</view>
		</scroll-view>
		<view class='main-cont' :style="{height:height-160-106+'rpx'}">
			<scroll-view scroll-y="true" class="groups-y-left" v-if="groups.length||product_type">
				<view :class="{active:sonIndex==''}" @click="sonTabAll()">全部</view>
				<view v-if="dianpuleibie==5&&groups.length" v-for="(item,index) in groups[currentIndex].son" :key="index" :class="{active:sonIndex==index}"
				 @click='sonTab(index)'>{{item.name}}</view>
				<view v-if="dianpuleibie==1||dianpuleibie==2" v-for="(item,index) in product_type" :key="index" :class="{active:sonIndex==index}"
				 @click='sonTab(index)'>{{item.name}}</view>
			</scroll-view>

			<scroll-view scroll-y="true" class="groups-y-right" bindscrolltolower="loadMore">
				<view v-if="!isloaded" class='loading-content'>
					<view class='loader2'></view>
					<text class='loading-tips'>加载中...</text>
				</view>
				<block v-if="isloaded">
					<navigator class='product-item' v-for="(item,index) in goods" :key="index" :url="'/pages/product_detail/product_detail?pid='+item.id">
						<image v-if="dianpuleibie==5" class='default-img' :src='item.default_imgurl'></image>
						<image v-if="dianpuleibie==1||dianpuleibie==2" class='default-img' :src='item.default_imgurl'></image>
						<view class='product-item-msg'>
							<view class='product-item-name'>{{item.name}}</view>
							<view class='product-item-price'>
								<text>￥</text>{{item.now_price}}</view>
						</view>
					</navigator>
				</block>
				<view v-if="isloaded&&goods.length==0" class='no-data'>
					暂无数据
				</view>
			</scroll-view>
		</view>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		getClassifyList,
		getClassifyProduct
	} from '../../common/api/index.js'
	export default {
		name: 'classify',
		data() {
			return {
				pages: 1,
				groups: [],
				currentIndex: 0,
				sonIndex: 100,
				goods:[],
				height: '',
				isloaded: false,
				hostUrl: '',
				product_type: '' //店铺2级分类
			};
		},
		created() {
			var _this = this
			var res = uni.getSystemInfoSync()
			this.height = 750 / res.windowWidth * res.windowHeight
			let { uname, ticket, id } = this.userInfo
			let params = {
				uname: this.userInfo.uname || '',
				ticket: this.userInfo.ticket || '',
				id: this.userInfo.id || ''
			}
			getClassifyList(params).then(res => {
				_this.groups = res.data.data,
				getClassifyProduct({
					type_all: 1,
					pages: _this.pages,
					user_id:this.userInfo.id||'',
					uname: this.userInfo.uname || '',
					ticket: this.userInfo.ticket || '',
					type_id: res.data.data[0].id
				}).then(res => {
					this.isloaded = true;
					this.goods = res.data.data
				})

			})
		},
		methods: {
			changTab(index) {
				if (this.currentIndex == index) {
					return
				}
				this.currentIndex = index
				this.isloaded = false,
					getClassifyProduct({
						type_all: 1,
						pages: 1,
						user_id:this.userInfo.id||'',
						uname: this.userInfo.uname || '',
						ticket: this.userInfo.ticket || '',
						type_id: this.groups[this.currentIndex].id,
					}).then(res => {
						this.goods = res.data.data,
							this.isloaded = true
					})
			},
			search(e) {
			  var keyword = e.detail.value;
			  wx.navigateTo({
				url: '/pages/productList/index?keyword=' + keyword
			  })
			},
			sonTab(index) {

				if (index == this.sonIndex) {
					return
				}

				this.sonIndex = index,
					this.isloaded = false

				getClassifyProduct({
					type_all: 1,
					user_id:this.userInfo.id||'',
					uname: this.userInfo.uname || '',
					ticket: this.userInfo.ticket || '',
					type_id: index === '' ? this.groups[this.currentIndex].id : this.groups[this.currentIndex].son[index].id,
				}).then(res => {
					this.goods = res.data.data,
						this.isloaded = true
				})
			},
			sonTabAll() {
				if (this.sonIndex == 100) {
					return
				}
				this.sonIndex = 100
				this.isloaded = false
				getClassifyProduct({
					type_all: 1,
					user_id:this.userInfo.id||'',
					uname: this.userInfo.uname || '',
					ticket: this.userInfo.ticket || '',
					type_id: this.groups[this.currentIndex].id,
				}).then(res => {
					this.goods = res.data.data,
						this.isloaded = true
				})
			}
		},
		computed: {
			...mapState([
				'dianpuleibie',
				'userInfo'
			])
		}
	}
</script>

<style scoped>
	page {
		height: 100%;
		background-color: #fff;
		font-size: 30rpx;
	}

	.left-tab {
		width: 180rpx;
		height: 100%;
		background-color: #f7f7f7;
	}

	.left-tab .item {
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		overflow: hidden;
		color: #555;
		font-size: 14px;
		border: 1px solid #ddd;
		border-bottom: none;
		border-left: none;
	}

	.left-tab .item:last-child {
		border-bottom: 1px solid #ddd;
	}

	.left-tab .active {
		background-color: #fff;
		border-right: none;
		border-left: 10rpx solid #444;
		color: #f66;
	}

	.content {
		width: 540rpx;
		padding: 0 15rpx;
		height: 100%;
		box-sizing: border-box;
	}

	.content .title {
		width: 100%;
		padding: 40rpx 0;
		float: left;
		font-size: 14px;
	}

	.content .title .title-name {
		float: left;
		color: #777;
	}

	.content .title .more {
		float: right;
		color: #f66;
	}

	.content .product {
		width: 100%;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.content .product .img {
		width: 150rpx;
		height: 150rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
	}

	.content .product .img image {
		width: 100%;
		height: 100%;
	}

	.content .product-list .list-item {
		height: 140rpx;
		margin: 15rpx 0;
		display: flex;
		align-items: center;
	}

	.search {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		/* background-color: #ddd; */
	}

	.search input {
		width: 650rpx;
		height: 70rpx;
		background-color: #f3f3f3;
		border-radius: 35rpx;
		padding-left: 40rpx;
		color: #555;
	}

	.groups-x {
		width: 100%;
		height: 60rpx;
		padding: 10rpx 0;
		white-space: nowrap;
		box-shadow: 1px 1px 2px #eef0ef;
	}

	.groups-x view {
		display: inline-block;
		width: 200rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		color: #5e605f;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.groups-x view.active {
		color: #5b9356;
	}

	.main-cont {
		display: flex;
		width: 100%;
	}

	.main-cont .groups-y-left {
		width: 190rpx;
		height: 100%;
		background-color: #f3f3f3;
	}

	.main-cont .groups-y-left view {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #888;
		border-bottom: 1px solid #eee;
	}

	.main-cont .groups-y-left view.active {
		color: #5b9356;
	}

	.main-cont .groups-y-right {
		width: 540rpx;
		height: 100%;
		margin-left: 20rpx;
	}

	.main-cont .groups-y-right .product-item {
		display: flex;
		align-items: center;
		height: 200rpx;
		border-bottom: 1px solid #eee;
		position: relative;
	}

	.main-cont .groups-y-right .product-item .shopping-cart {
		position: absolute;
		bottom: 30rpx;
		right: 20rpx;
		width: 40rpx;
		height: 40rpx;
	}

	.main-cont .groups-y-right .product-item image {
		width: 140rpx;
		height: 140rpx;
	}

	.main-cont .groups-y-right .product-item .product-item-msg {
		width: 320rpx;
		height: 140rpx;
		margin-left: 20rpx;
	}

	.main-cont .groups-y-right .product-item .product-item-msg .product-item-name {
		color: #3b3b3b;
		height: 80rpx;
		line-height: 40rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.main-cont .groups-y-right .product-item .product-item-msg .product-item-price {
		height: 60rpx;
		line-height: 60rpx;
		color: #c30;
	}

	.main-cont .groups-y-right .product-item .product-item-msg .product-item-price text {
		font-size: 24rpx;
	}

	/* 加载动画 */

	.loading-content {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 200rpx;
	}

	.loading-content .loader2 {
		width: 40rpx;
		height: 40rpx;
		display: inline-block;
		padding: 0px;
		border-radius: 100%;
		border: 8rpx solid;
		border-top-color: #888;
		border-bottom-color: rgba(0, 0, 0, 0.1);
		border-left-color: #888;
		border-right-color: rgba(0, 0, 0, 0.1);
		-webkit-animation: loader2 1s ease-in-out infinite;
		animation: loader2 1s ease-in-out infinite;
	}

	.loading-content .loading-tips {
		margin-left: 5px;
		color: #777;
	}

	@keyframes loader2 {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.no-data {
		width: 100%;
		height: 200rpx;
		line-height: 200rpx;
		text-align: center;
		color: #555;
	}
</style>
