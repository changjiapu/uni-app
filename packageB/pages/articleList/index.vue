<template>
	<view class="artlist" v-if="imgList.length || artlist.length">
		<swiper class="swiper" indicator-color="#eee" indicator-active-color="#0099FF" :indicator-dots="true" :autoplay="true" :interval="4000" :duration="500" :circular="true">
		  <swiper-item class="swiper-item" v-for="(item, index) in imgList" :key="index">
			<image class="img" :src="baseURL+'/public/static/plat/public/uploads/'+item.img"></image>
		  </swiper-item>
		</swiper>
<!-- 		<view class='middle'>阅读区</view> -->
		<view class='container1'>
		  <view class='item' v-for="(item, index) in artlist" :key="index" @click="viewAirtcle(item)">
			<view class='img'>
			  <image :src="item.img_url"></image>
			</view>
			<text class='title'>{{item.title}}</text>
			<text v-if="item.is_pay" class='pirce'>售价￥{{item.pay_price}}</text>
			<text v-else class='sign'>欢迎阅读</text>
		  </view>
		</view>
	</view>
</template>

<script>
	import { articleSlide, articleList, articleOrder } from '@/common/api'
	import { baseURL } from '@/common/utils/config'
	export default {
		name: 'artcleList',
		data () {
			return {
				baseURL: baseURL,
				imgList: [],
				artlist: []
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList () { // 轮播图 和 文章列表
				articleSlide().then(res => {
					if (!res.data.code) {
						this.imgList = res.data.data
						articleList().then(k => {
							if (!res.data.code) this.artlist = k.data.data
						})
					}
				})
			},
			viewAirtcle(item) {
				if (+item.is_pay) {
					uni.showModal({
						title: '',
						content: '该文章为付费文章',
						confirmText: '前往付款',
						success(res) {
							console.log(res)
							if (res.confirm) {
								const params = {
									type: 2,
									pid: item.id,
									price: item.pay_price
								}
								articleOrder(params).then(res => {
									console.log(res)
									if (!res.data.code) {
										uni.navigateTo({
											url: '/packageB/pages/articlePay/index?price=' + item.pay_price + '&batchcode=' + res.data.batchcode + '&type=2'
										})
									}
								})
							}
						}
					})
				} else {
					uni.navigateTo({
						url: '/packageB/pages/articleDetail/index?type=' + item.type + '&pid=' + item.id
					})
				}
			}
		}
	}
</script>

<style lang="less">
@import '../../../common/css/variables.less'; 	
.artlist {
	.swiper{
		width: 750upx;
		height: 375upx;
		.img {
			width: 100%;
			height: 100%;
		}
	}	
	.middle{
	  padding: 15upx 0;
	  font-size: 26upx;
	  color:#707070;
	  background-repeat: no-repeat;
	  background-size: 50upx 50upx;
	  padding-left: 90upx;
	  background-position: 30upx center;
	  background-image: url("@{URL}/weixinpl/shopping-temp/images/artlist.png");
	}
	.container1 {
	  display: flex;
	  flex-wrap: wrap;
	  align-items: center;
	  box-sizing: border-box;
	  .item {
	    width: 49%;
	    margin-top: 10upx;
	    height: 400upx;
	    display: flex;
	    flex-direction: column;
	    justify-content: center;
	    align-items: center;
	    position: relative;
	    border: 1upx solid #eee;
		.img {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 280upx;
			width: 280upx;
			box-shadow: 3px 3px 3px #ccc;
			border-radius: 100%;
			image {
				height: 200upx;
				width: 200upx;
				border-radius: 100%;
			}
		}
		.title {
			margin-left: 20upx;
			color: #6da722;
			margin-top: 10upx;
			width: 80%;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			font-size: 26upx;
		}
		.sign {
			transform: rotate(-30deg);
			position: absolute;
			top: 20upx;
			left: 20upx;
			font-size: 20upx;
			color: orange;
			padding: 5upx 2upx;
		}
		.pirce {
			transform: rotate(-30deg);
			position: absolute;
			top: 20upx;
			left: 20upx;
			font-size: 20upx;
			color: rgb(255, 0, 85);
			padding: 6upx 3upx;
		}
	  }
	}	
}	
	
</style>
