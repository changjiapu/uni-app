<template>
	<view class="videoList">
		<view v-for="(item, index) in video_list" :key='index'>
		  <video class="video" :poster="item.back_picture" :vid="item.vid" :autoplay="isfalse" :playerid="'myVideo_' + item.id"></video>
		  <view class='middle'>
			<view class='left' @click="videoDetail(item)">{{item.title}}</view>
			<view class='right'>
			  <button class='box btn' open-type="share">
				<view class="share"></view>
			  </button>
			  <view class="box">
				  <view :class="['collect', { act: item.user_status }]" @click="myfavourite(item)"></view>
				  <text>{{item.collect_count}}</text>
			  </view>
			  <view class="box">
				  <view class="comment" @click="videoDetail(item)"></view>
				  <text>{{item.comment_count}}</text>
			  </view>
			</view>
		  </view>
		  <view class='msg'>
			<view class="msg_content">
			  <view class='left'>{{item.info}}</view>
			</view>
		  </view>
		</view>
	</view>
</template>

<script>
import { videoList, addfavorite } from '@/common/api/packageB'
export default {
	name:'videoList',
	data () {
		return {
			isShow: true,
			isfalse: false,
			video_list: [],
			payLogo: 1
		}
	},
	onShow () {
		this.getList()
	},
	methods: {
		getList () { // 获取视频列表
			videoList().then(res => {
				if (!res.data.code) {
					this.video_list = res.data.data
				}
			})
		},
		videoDetail (item) {
			const data = encodeURIComponent(JSON.stringify(item))
			uni.navigateTo({
				url: `/packageB/pages/videoComment/index?data=${data}`
			})
		},
		myfavourite (item) { // 收藏视频
			const data = {
				appid: 'wxd3451cfb485bad19',
				type: 2,
				data_type: 1,
				collect_id: item.id	
			}
			addfavorite(data).then(res => {
				if (!res.data.code) {
					if (item.user_status) {
						item.user_status = 0
						item.collect_count--
					} else {
						item.user_status = 1
						item.collect_count++
					}
				}
			})
		}
	}
}
</script>

<style lang="less">
@import '../../../common/css/variables.less';	
.videoList {
	.video { width: 100% }
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
	  padding: 15upx 20upx;
	  color: #999;
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
		  .left { 
			  font-size: 28upx;
			  text-indent: 58upx;
			  line-height: 44upx;
		      overflow : hidden;
			  text-overflow: ellipsis;
			  display: -webkit-box;
			  -webkit-line-clamp: 2;
			  -webkit-box-orient: vertical;
			  }
	  }
	}
}	
</style>
