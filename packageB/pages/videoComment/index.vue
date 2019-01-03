<template>
	<view :class="['comment',{ act: flag}]">
		<view class="main">
		<view class="top">
			<video v-if="!flag" class="video" :poster="item.back_picture" :vid="item.vid" :autoplay="isfalse" :playerid="'myVideo_' + item.id">
			</video>
			<view class='middle'>
			<view class='left'>{{item.title}}</view>
			<view class='right'>
				<button class='box btn' open-type="share">
				<view class="share"></view>
				</button>
				<view class="box">
					<view :class="['collect', { act: item.user_status }]" @click="myfavourite"></view>
					<text>{{item.collect_count}}</text>
				</view>
				<view class="box">
					<view class="comment" @click="showDialog"></view>
					<text>{{item.comment_count}}</text>
				</view>
			</view>
			</view>
			<view class='msg'>
			<view class="msg_content">
				<scroll-view scroll-y class="scroll_comment">
					<view class="left">{{item.info}}</view>
				</scroll-view>
			</view>
			</view>
		</view>
		<scroll-view scroll-y class="list">
			<view class="item" v-for="(item, index) in list" :key="index">
				<view class="floor">
					<view class="avatar" :style="{ backgroundImage: 'url('+ item.weixin_headimgurl +')' }"></view>
					<view class="info">
						<view class="flx">
							<text class="name">{{ item.weixin_name }}</text>
							<view class="cut">
								<view>
									<text class="line">{{ index + 1 }}楼</text>
									<text>{{ item.createtime }}</text>
								</view>
							</view>
						</view>
						<view class="wdn">
							<view class="cmd" @click="AddLinkes(item)">
								<view :class="['good', { act: item.is_fabulous }]"></view>
								<text>{{ item.fabulous }}</text>
							</view>
							<view class="cmd">
								<view class="comment"></view>
								<text>{{ item.review_content.length }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="content">
					{{ item.comment }}
					<view class="imgList" v-if="item.comment_img.length">
						<view class="image" v-for="(n, i) in item.comment_img" :key="i" :style="{ backgroundImage: 'url(' + n + ')' }"></view>
					</view>
				</view>
				<view class="box">
					<view class="replay" v-for="(rst, d) in item.review_content" :key="d">
						<view class="floor">
							<view class="avatar" :style="{ backgroundImage: 'url(' + rst.weixin_headimgurl + ')' }"></view>
							<view class="info">
								<view class="flx">
									<text class="name"><text class="uname">{{ rst.weixin_name }}：</text>回复{{rst.uid_name}}</text>
									<view class="cut">
										<view>
											<text>{{ item.createtime }}</text>
										</view>
									</view>
								</view>
								<view class="wdn">
									<view class="cmd">
										<view class="comment"></view>
									</view>
								</view>
							</view>
						</view>
						<view class="content">
							{{ rst.comment }}
							<view class="imgList" v-if="rst.comment_img.length">
								<view class="image" v-for="(n, i) in rst.comment_img" :key="i" :style="{ backgroundImage: 'url(' + n + ')' }"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		</view>
		<view class='dialog'>
		  <view class='content'>
			<view class='input'>
			  <textarea placeholder='发表评论'></textarea>
			</view>
			<view class='img' v-if="imgList.length">
				<view class="image" :style="{ backgroundImage: 'url('+item+')' }" v-for="(item, index) in imgList" :key="index"></view>
			</view>
			<view class='submit'>
			  <view class='left' @click="showDialog">取消</view>
			  <view class='right'>
				<view class="addimg" @click.stop="uploadImg">
					<view class="cover"></view>
				</view>
				<text @click.stop='addComment' class="text">发送</text>
			  </view>
			</view>
		  </view>
		</view>		
	</view>
</template>

<script>
	import { addfavorite, videoComment, faBuLoues, AddComment } from '@/common/api/packageB'
	import { baseURL } from '@/common/utils/config'
	export default {
		name: 'videoComment',
		data() {
			return {
				baseURL: baseURL,
				item: {},
				isfalse: false,
				flag: false,
				params: {
					pages: 1,
					comment_id: 0,
					data_type: 1
				},
				list: [],
				msg: {
					comment_id: 0 ,//视频id,
					data_type: 1, // 1.视频， 2.文章
					comment: '',
					uid: 0,
					
				},
				likes: {
					data_type: 1,
					type: 1, // 1取消，2点赞
					parent_id: 0
				},
				imgList: [],
				
			};
		},
		onLoad (option) {
			this.item = JSON.parse(decodeURIComponent(option.data))
			this.params.comment_id = this.item.id
			this.commentList()
		},
		methods: {
			myfavourite () { // 收藏视频
				const data = {
					appid: 'wxd3451cfb485bad19',
					type: 2,
					data_type: 1,
					collect_id: this.item.id	
				}
				addfavorite(data).then(res => {
					if (!res.data.code) {
						if (this.item.user_status) {
							this.item.user_status = 0
							this.item.collect_count--
						} else {
							this.item.user_status = 1
							this.item.collect_count++
						}
					}
				})
			},
			uploadImg () { // 上传图片
				const _this = this
				uni.chooseImage({
				  count: 9, // 默认9  
				  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
				  sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
				  success (res) {
					_this.imgList = _this.imgList.concat(res.tempFilePaths)
				  }
               })
			},
		    addComment () { // 添加评论
			  const _this = this
			  const UpLoad = () => {
				  const list = []
				  return new Promise((resolve, reject) => {
					  this.imgList.forEach((item, index) => {
					  	uni.uploadFile({
					  		url: this.baseURL+'/smallroutine/Reward/upload_eval',
					  		filePath: item,
					  		name: 'img',
					  		formData: { customer_id: 810 },
					  		header: { 'Content-Type': 'multipart/form-data' },
					  		success(res) {
					  			list.push(res.data)
								if (index === _this.imgList.length - 1) resolve(list)
					  		},
							fail(err) {
								reject(err)
							}
					  	})
					  })
				  })
			  }
			  UpLoad().then(res => {
				  console.log(res)
			  })
			},
			showDialog () {
				this.flag = !this.flag
			},
			commentList () { // 评论列表
				videoComment(this.params).then(res => {
					if (!res.data.code) this.list = res.data.data
				})
			},
			AddLinkes (item) { // 点赞
			    this.likes.parent_id = item.id
				item.is_fabulous ? this.likes.type = 1 : this.likes.type = 2
				faBuLoues(this.likes).then(res => {
					if (!res.data.code) {
						if (item.is_fabulous) {
							item.is_fabulous = false
							item.fabulous--
						} else {
							item.is_fabulous = true
							item.fabulous++
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
	@import '../../../common/css/variables.less';	
uni-page-body, page { height: 100%;}
.comment {
	height: 100%;
	overflow: hidden;
	& > .main {
		display: flex;
		flex-flow: column;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		position: relative;
		z-index: 22;
		& > .top {
			.video { width: 100%;display: block;transform: translate3d(0, 0, 0) }
			.middle {
				padding: 20upx 20upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #eee;
				.left {
					font-size: 36upx;
					font-weight: bold;
					color: #607D8B;
					background: url("@{URL}/weixinpl/shopping-temp/images/share_t.png") no-repeat left center/35upx 35upx;
					padding-left: 58upx;
				}
				.img {
					height: 50upx;
					width: 50upx;
					margin-left: 10upx;
				}
				.right {
					display: flex;
					align-items: center;
					.box {
						display: flex;
						margin-right: 20upx;
						font-size: 32upx;
						align-items: center;
						color:#878088;
						&.btn {
							border: 0 none;
							background:transparent;
						}
						&:last-of-type { margin: 0; }
						.share {
							width: 50upx;
							height: 50upx;
							background: url("@{URL}/weixinpl/shopping-temp/images/share_.png") no-repeat center center/contain;					
						}
						.collect {
							width: 45upx;
							height: 45upx;
							border-radius: 50%;
							border: 1px solid #EA6F5A;
							background: url("@{URL}/weixinpl/shopping-temp/images/step.png") no-repeat;
							background-position: left;
							background-size: auto 100%;
							margin-right: 10upx;
							&.act {
								background-color: #EA6F5A;
								background-position: right;
								transition: background .6s steps(19);
							}
						}
						.comment {
							width: 55upx;
							height: 55upx;
							background: url("@{URL}/weixinpl/shopping-temp/images/review.png") no-repeat center center/contain;
						}
					}
					.btn {
						&::after {
							border: none
						}
					}
				}
			}
			.msg {
			color: #999;
			border-bottom: 1px solid #eee;
            box-shadow: 0px 6px 11px 0px #efefef;			
			.msg_title {
				display: flex;
				align-items: center;
				.img {
					height: 30upx;
					width: 30upx;
					margin: 0 20upx;  
				}
			}
			.msg_content {
				display: flex;
				justify-content: space-between;
				.scroll_comment {
					max-height: 150upx;
					.left {
						padding: 15upx 20upx;
						font-size: 28upx;
						text-indent: 58upx;
						line-height: 44upx;
						}
					}
					}
			}
		}
		& > .list {
			flex: 1;
			overflow: hidden;
			.item { 
				margin: 10px 15px;
				border-bottom:1px solid #eee;
				&:last-of-type {
					margin-bottom: 0;
					border-bottom: 0;
				}
				.floor {
					display: flex;
					.avatar {
						width: 80upx;
						height: 80upx;
						background-repeat: no-repeat;
						background-size: cover;
						background-position: top center;
						border-radius: 100%;
						overflow: hidden;
						margin-right: 20upx;
					}
					.info {
						flex: 1;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.flx {
							display: flex;
							flex-flow: column;
							flex-direction: column;
							justify-content: space-between;
							font-size: 26upx;
							padding: 10upx 0;
							.cut {
								display: flex;
								justify-content: space-between;
								font-size: 22upx;
								color:#a0a0a0;
								.line {
									position: relative;
									padding-right: 15upx;
									margin-right: 15upx;
									&::after {
										position: absolute;
										width: 1px;
										height: 100%;
										top: 0;
										right: 0;
										background-color:#bdbdbd;
										content: '';
										transform: scaleY(.7)
									}
								}
							}
						}
						.wdn {
							display: flex;
							.cmd {
								display: flex;
								margin-right: 20upx;
								font-size: 26upx;
								align-items: center;
								color:#878088;
								&:last-of-type { margin: 0}
								.comment {
									width: 40upx;
									height: 40upx;
									margin-right: 8upx;
									background: url("@{URL}/weixinpl/shopping-temp/images/review.png") no-repeat center center/contain;
								}
								.good {
									background: url("@{URL}/weixinpl/shopping-temp/images/fave.png");
									background-position: left;
									background-repeat: no-repeat;
									height: 80upx;
									width: 80upx;
									position: relative;
									right: -15upx;
									background-size: 2900%;
									&.act {
										background-position: right ;
										transition: background 1s steps(28);
									}
								}
							}
						}
					}
				}
				.content, .box {
					width: 100%;
					padding-left: 100upx;
					box-sizing: border-box;
				}
				.box {
					padding-top: 15upx;
					.replay {
						margin-bottom: 15upx;
						padding-bottom: 15upx;
						border-bottom: 1px dashed #eee;
						&:last-of-type {
							margin-bottom: 0;
							border-bottom: 0;
						}
						.uname { color: #263ce4}
					}
				}
				.content {
					font-size: 26upx;
					line-height: 40upx;
					.imgList {
						display: flex;
						flex-wrap: wrap;
						border-top: 1px dashed #eee;
						margin: 15upx 0 0;
						padding-top: 5upx;
						.image {
							width: 100upx;
							height: 100upx;
							margin: 10upx;
							background-repeat: no-repeat;
							background-size: contain;
							background-position: center center;
							float:left;
						}
					}
				}
			}
		}
	}
	& > .dialog {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		background-color: rgba(0, 0, 0, 0);
		height: 100%;
		width: 100%;
		opacity: 0;
				.content {
			transform: translate3d(0,-120%,0);					
			border-radius: 15upx;
			overflow: hidden;
			padding: 20upx;
			background-color: #fff;
			width: 95%;
			margin: 15px auto;
			box-sizing: border-box;
			box-shadow: 0 0 12px #191919;
			.img {
				height: 20%;
				display: flex;
				flex-wrap: wrap;
				border-top:1px dashed #f7f7f7;
				padding-top: 15upx;
				.image {
					height: 112upx;
					width: 112upx;
					margin: 10upx;
					background-size: contain;
					background-repeat: no-repeat;
					background-position: center center;
					border: 1px solid #f7f7f7;					
				}
			}
			.input {
				height: 30%
			}
			.submit {
				margin-top: 20upx;
				display: flex;
				justify-content: space-between;
				.left, .right .text, .right .addimg {
					color: #fff;
					background-color: #f44336;
					padding: 15upx 25upx;
					border-radius: 10upx;
					font-size: 22upx;
				}
				.right {
					display: flex;
					.addimg {
						background-color: #009688;
						margin-right: 15upx;
						width: 30upx;
						.cover {
							width: 100%;
							padding-top: 100%;
							background-repeat: no-repeat;
							background-size:contain;
							background-position: center center;
							background-image: url("@{URL}/weixinpl/shopping-temp/images/uploadImg.png");
						}
						
					}
					.text {
						background-color: #009688;
					}
				}
			}
		}		
	}
	&.act {
		& > .dialog {
			opacity: 1;
			transition: background .2s linear;
			background-color: rgba(0,0,0,.7);
			z-index: 33;
			.content {
				transition: transform .5s ease-in-out;
				transform: translate3d(0,0,0);
			}
		}
	}
}
</style>
