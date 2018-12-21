<template>
	<view class="comment">
		<view class="list">
			<view class="item" v-for="(item, index) in Info.shop_orders" :key="index">
				<view :style="{backgroundImage: 'url('+item.default_imgurl+')'}"></view>
				<view>
					<view>
						<view>
							<text>{{ item.pname }}</text>
							<text>{{ item.name }}</text>
						</view>
						<text>&yen;{{item.now_price}}</text>
					</view>
					<view>
						<text>x{{ item.rcount }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="level">
			<view>评分</view>
			<view>
			<view @tap="params.level = i" class="default" v-for="i in 5" :key="i" :class="{ act: i <= params.level}"></view>
			</view>
		</view>
		<view class="reason">
			<textarea class="text" v-model="params.discuss" placeholder="请描述您的评论，不超过200字" auto-focus/>
		</view>
		<view class="img">
			<view class="title">图片<text>(选填，提供截图，总大小10M以下)</text></view>
			<view class="contain">
				<view @tap="preview(index)" v-if="list.length" :style="{ backgroundImage: 'url('+ item.path +')' }" v-for="(item, index) in list" :key="index"></view>
				<view class="addImg" @tap="chooseImg"></view>
			</view>
		</view>
		<view class="btn">
			<button type="warn" @tap="submit" :loading="loading">提交</button>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
    import { orderDetail, BagOrderDetail, UploadEval, Comment } from '@/common/api'
	import { baseURL } from '@/common/utils/config'
	export default {
		name: 'comment',
		data() {
			return {
				params: {
					batchcode: '',
					user_id: '',
					level: 0,
					discuss: '',
					pid: [],
					img: ''
				},
				upLoadIMG: [],
				loading: false,
				list:[],
				Info: {},
				baseURL: baseURL
			}
		},
		onLoad(opt) {
			this.params.batchcode = opt.batchcode
			this.params.user_id = this.userInfo.id
			this.getInfo()
		},
		methods: {
			getInfo() {
				orderDetail(this.params).then(res => {
					let data = res.data[0]
					for (var i = 0; i < data.shop_orders.length; i++) {
						data.shop_orders[i].now_price = (data.shop_orders[i].totalprice / data.shop_orders[i].rcount).toFixed(2);
					}
					this.Info = data
					this.Info.shop_orders.forEach(item => {
						this.params.pid.push(item.product_id)
					})
					console.log(JSON.stringify(this.params.pid))
					this.params.pid = JSON.stringify(this.params.pid)
				})
			},
			chooseImg () {
				uni.chooseImage({
					sizeType: ['original', 'compressed'],
					success: res => {
						this.list = [...this.list, ...res.tempFiles]
					}
				})
			},
			preview (idx) {
				uni.previewImage({
					current: this.list[idx].path,
					urls: this.list.map(item => item.path)
				})
			},
			submit () {
				if (!this.params.level) {
					uni.showToast({ title: '请选择评分', icon: 'none' })
				} else if (!this.params.discuss) {
					uni.showToast({ title: '请输入评论', icon: 'none' })
				} else if (this.size > 10){
					uni.showToast({ title: '图片大小超过10M', icon: 'none' })
				} else {
					uni.showLoading()
					const uploadImg = () => {
						return new Promise((resolve, reject) => {
							if (this.list.length) {
								this.list.forEach((item, index) => {
									uni.uploadFile({
										url: `${this.baseURL}/smallroutine/Reward/upload_eval`,
										filePath: item.path,
										name: 'img',
										formData: {
											customer_id: this.userInfo.customer_id,
											batchcode: this.Info.batchcode
										},
										header: { 'Content-Type': 'multipart/form-data' },
										success: res => {
											this.upLoadIMG.push(res.data)
											if (index === this.upLoadIMG.length - 1) {
												this.params.img = this.upLoadIMG.toString()
												resolve(true)
											}
										},
										fail: () => {
											reject(false)
										}
									})
								})
							} else {
								resolve(true)
							}
						})
					}
					uploadImg().then(res => {
						uni.hideLoading()
						if (res) {
							Comment(this.params).then(res => {
								uni.showModal({
									title: '',
									content: '评论成功',
									success: res => {
										if (res.confirm) {
											uni.navigateBack()
										}
									}
								})
							})
						}
					})
				}
			}
		},
		computed: {
			...mapState([
				'userInfo'
			]),
			size () {
				if (this.list) {
					let size = this.list.reduce((prev, cur) => cur.size + prev, 0)
					return size / (1024 * 1024)
				}
				return 0
			}
		}		
	}
</script>

<style lang="less">
	@import '../../common/css/variables.less'; 
.comment {
	.list {
		background:white;
		padding: 25upx 15px;
		.item {
			display: flex;
			position: relative;
			padding-bottom: 15px;
			margin-bottom: 15px;
			&:last-of-type {
				margin: 0;
				padding: 0;
				&::after {
					display: none;
				}
			}
			&::after {
				content: '';
				position: absolute;
				left: 0;
				width: 100%;
				border:1px dashed whitesmoke;
				bottom: 0;
			} 
			& > view {
				&:nth-of-type(1) {
					width: 146upx;
					height: 146upx;
					background-repeat: no-repeat;
					background-size: cover;
					background-position: top center;
					margin-right: 15px;
					background-image: url("@{URL}/weixinpl/shopping-temp/images/none.png");
				}
				&:nth-of-type(2) {
					flex:1;
					display: flex;
					flex-direction: column;
					flex-flow: column;
					justify-content: space-between;
					& > view {
						font-size: 26upx;
						&:nth-of-type(1) {
							display: flex;
							justify-content: space-between;
						}
						&:nth-of-type(2) {
							text-align: right;
						}
					}
				}
			}
		}
	}
	.level {
		background-color:white;
		margin: 10px 0;
		padding: 20upx 15px;
		font-size: 26upx;
		display: flex;
		align-items: center;
		& > view {
			&:nth-of-type(1) { margin-right: 20upx; }
			&:nth-of-type(2) {
				display: flex;
				flex: 1;
				& > view {
					width: 30upx;
					height: 30upx;
					background-repeat: no-repeat;
					background-size:contain;
					background-position: center center;
					margin: 0 10upx;
					transition: background .2s;
					&.default {
						background-image: url("@{URL}/weixinpl/shopping-temp/images/start.png")
					}
					&.act {
						background-image: url("@{URL}/weixinpl/shopping-temp/images/start_1.png")
					}
				}
			}
		}
	}
	.reason {
		background-color: white;
		padding:15px;
		.text {
			width: 100%;
		}
	}
	.img {
		margin-top: 10px;
		.title {
			height: 80upx;
			line-height: 80upx;
			font-size:26upx;
			padding: 0 15px;
			background:white;
			box-sizing: border-box;
			border-bottom:1px solid #f1f1f1;
			text {
				font-size: 22upx;
				color:#666
			}
		}
		.contain {
			display: flex;
			flex-wrap: wrap;
			padding: 20upx 15px;
			background-color:white;
			& > view {
				background-repeat: no-repeat;
				background-size: cover;
				background-position: center center;
				width: 120upx;
				height: 120upx;
				margin: 10upx ;
				&.addImg {
					background-image:url("@{URL}/weixinpl/shopping-temp/images/addImg.png")
				}
			}
		}
	}
	.btn {
		margin: 60upx 15px;
	}
}
</style>
