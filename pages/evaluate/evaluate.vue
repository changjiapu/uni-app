<template>
	<view class="">
		<view class='title'>
			<view v-for="(item, index) in tabs" :class="{ act: index === current_tab }" :key="index" @tap="showComment(index)"> {{ item }}</view>
		</view>
		<view class="main">
			<scroll-view  scroll-y :style="{height:content_height+'px',}" @scrolltolower="loadMore">
				<view class='product-evaluate' v-if="!current_tab">
					<block v-if="evaluate.length">
						<view class='evaluate-cont' v-for="(item,index) in evaluate" :key='index'>
							<view class='evaluate-name'>
								<view class='name'>{{item.weixin_name}}</view>
								<view class='img evaluate' style='width:150upx;'>
									<view :style="{width:item.level/5*100+'%'}">
										<image mode='widthFix' :src="baseURL+'/weixinpl/shopping-temp/images/grade.png'" style='width:150upx;'></image>
									</view>
					<!-- 				<view v-for="i in item.level" :key="i">
										<image mode='widthFix' :src="baseURL+'/weixinpl/shopping-temp/images/xing.png'" style='width:150upx;'></image>
									</view>
									<view v-for="i in 5" :key="i">
										<image mode='widthFix' :src="baseURL+'/weixinpl/shopping-temp/images/xing2.png'" style='width:150upx;'></image>
									</view> -->
								</view>
							</view>
							<view class='evaluate-detail'>
								{{item.discuss}}
							</view>
							<view class='evaluate-img'>
								<view class='img' v-for="(value, idx) in item.discussimg" :key="idx" v-if="value" @click='previewImage(intex,value)'>
									<image mode='aspectFit' :src='value' style='width:100%;height:100%'></image>
								</view>
							</view>
							<view class='evaluate-time'>
								<text>{{item.createtime}}</text>
							</view>
						</view>
					</block>
					<empty-data v-else></empty-data>
				</view>
				<view v-if="current_tab">
					<block v-if="IMGLIST.length"></block>
					<empty-data v-else></empty-data>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { product_evaluations } from "@/common/api"
	import { baseURL } from '@/common/utils/config'
	export default {
		name: 'evaluate',
		data() {
			return {
				baseURL: baseURL,
				content_height: '',
				current_tab: 0,
				tabs: ['全部评论', '晒图'],
				evaluate:[],
				IMGLIST: [],
				product_id: ''
			}
		},
		onLoad(options) {
			this.content_height = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().windowWidth * (95 / 750);
			this.product_id = options.id
			var params = {
				product_id: this.product_id,
				num: 2,
				pagea: 1
			}
			product_evaluations(params).then(res => {
				this.evaluate = res.data
				res.data.forEach(item => {
					this.IMGLIST = [...this.IMGLIST, ...item.discussimg]
				})
	
			})
		},
		methods: {
			showComment(idx) {
				this.current_tab = idx
			}
		},
		computed: {

		}
	}
</script>

<style scoped>
page {
    background-color: #fff;
}

.title {
    width: 100%;
    height: 95upx;
}

.title view {
    width: 375upx;
    height: 89upx;
    line-height: 89upx;
    text-align: center;
    color: #888;
    border-bottom: 6upx solid #ddd;
    float: left;
}

.title view.act {
    color: #c33;
    border-bottom: 6upx solid #c33;
}

.product-evaluate {
    padding: 0 20upx;
}

.product-evaluate .evaluate-cont {
    padding: 20upx 0;
    border-bottom: 1px solid #eee;
}

.product-evaluate .evaluate-cont .evaluate-name {
    display: flex;
    align-items: center;
}

.product-evaluate .evaluate-cont .evaluate-name .name {
    margin-right: 15upx;
    font-size: 26upx;
}

.product-evaluate .evaluate-cont .evaluate-detail {
    margin-top: 20upx;
    line-height: 40upx;
}

.product-evaluate .evaluate-cont .evaluate-img {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10upx;
}

.product-evaluate .evaluate-cont .evaluate-img .img {
    width: 150upx;
    height: 150upx;
    margin-right: 15upx;
    margin-bottom: 15upx;
    background-color: #eee;
}

.product-evaluate .evaluate-cont .evaluate-time {
    color: #aaa;
    margin-top: 10upx;
    display: flex;
    flex-wrap: wrap;
    font-size: 26upx;
}

.product-evaluate .evaluate-cont .evaluate-time text {
    margin: 0 4px;
}

.product-evaluate .evaluate-cont .evaluate-time text:nth-child(1) {
    margin-left: 0;
}

</style>
