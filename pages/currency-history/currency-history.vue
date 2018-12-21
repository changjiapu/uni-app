<template>
	<view class="currency_history">
		<view class='head'>
			<view class='head_head' @click='isShowChange'>
				<image :src="baseURL+'/weixinpl/shopping-temp/images/zhuanzeng2.png'"></image>
				<text>转增规则</text>
			</view>
			<view class='head_middle'>
				<image :src="baseURL+'/weixinpl/shopping-temp/images/shopping.png'"></image>
				<text>￥{{data.currency}}</text>
			</view>
			<view class='head_footer'>
				<text @click='gotoZhuanzeng'>转增</text>
				<text @click='gotoChongzhi'>充值</text>
			</view>
		</view>
		<view class='tabs'>
			<view v-for='(item,index) in tabs' :key='index' :class="{active:active_tab==index}" @click='currentTabChange(index,item.type)'>{{item.name}}</view>
		</view>
		<view class="main">
			<scroll-view scroll-y :style="{height:content_height+'px'}" v-if='this.list.length'>
				<view class='content' v-for="(item,index) in list" :key='index'>
					<navigator class='list'>
						<view class='spend'>{{item.remark}}</view>
						<view class='time'>{{item.createtime}}</view>
						<view class='money'>
							<text>{{item.type==0?'-':'+'}}</text>{{item.cost_currency}}</view>
					</navigator>
				</view>
			</scroll-view>
			<empty-data>你还没有相关订单</empty-data>
		</view>
	</view>
</template>

<script>
	import {
		myCurrencyList,
		shopping_mone
	} from '@/common/api'
	import {
		mapState
	} from 'vuex'
	import { baseURL } from '@/common/utils/config'
	export default {
		data() {
			return {
				baseURL: baseURL,
				tabs: [{
					name: '全部',
					type: 2
				}, {
					name: '收入',
					type: 1
				}, {
					name: '支出',
					type: 0
				}],
				data: {
					currency: ''
				},
				active_tab: 0,
				content_height: '',
				list: [],
				params: {
					type: 2,
					page: 1
				},
				userInfo2: {
					uname: '',
					ticket: '',
					user_id: '',
				}
			};
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					let windowHeight = parseInt(res.windowHeight)
					let windowWidth = parseInt(res.windowWidth)
					this.content_height = windowHeight - windowWidth * (90 / 750);
				}
			});
			this.userInfo2.uname = this.userInfo.uname
			this.userInfo2.ticket = this.userInfo.ticket
			this.userInfo2.user_id = this.userInfo.id
			this.getData()
			shopping_mone({
				user_id: this.userInfo.id
			}).then(res => {
				if (!res.data.code) {
					this.data.currency = res.data.data.currency
				}

			})

		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		methods: {
			currentTabChange(index, type) {
				this.active_tab = index
				this.params.type = type
				this.params.page = 1
				this.list = []
				this.getData()
			},
			getData() {
				var sendData = {
					...this.userInfo2,
					type: this.params.type,
					paginate: this.params.page
				}
				myCurrencyList(sendData).then(res => {
					if (res.data.code) {
						if (res.data.data.length) {
							this.load = true
							this.list = [...this.list, ...res.data.data]
						} else {
							this.load = false
							uni.showToast({
								icon: 'none',
								title: '没有更多数据啦>_<'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
	uni-page-body,
	page {
		height: 100%;
	}

	.currency_history {
		height: 100%;
		display: flex;
		flex-direction: column;
		.head {
			background-color: rgb(0, 153, 255);

			.head_head {
				margin-left: 70%;
				height: 50upx;
				line-height: 50upx;
				display: flex;
				color: #FFF;
				font-size: 16px;

				&>image {
					margin: auto 0;
					width: 50upx;
					height: 30upx;
				}
			}

			.head_middle {
				display: flex;
				align-items: center;
				margin-left: 15%;
				font-size: 30px;
				font-weight: 600;
				color: #FFF;

				&>image {
					width: 100upx;
					height: 100upx;
					margin-right: 20upx;
				}
			}

			.head_footer {
				width: 100%;
				display: inline-flex;
				margin: 20upx;
				color: #FFF;

				&>text {
					padding: 15upx;
					background-color: #FF6A6A;
					border-radius: 10upx;

				}

				&>text:nth-child(1) {
					margin-left: 38%;
					margin-right: 20upx;
				}

			}

		}

		.tabs {
			background-color: #fff;
			display: flex;
			justify-content: space-around;

			view {
				width: 250upx;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				border-bottom: 4upx solid #eee;
				position: relative;

				&::after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 0;
					height: 2px;
					width: 100%;
					background-color: #FF6633;
					transform: scaleX(0);
					transition: transform .2s ease-in-out;
				}

				&.active {
					color: #FF6633;

					&::after {
						transform: scaleX(0.8);
					}
				}
			}
		}

		.main {
			flex: 1;
			position: relative;

			.list {
				position: relative;
				padding: 15upx 15upx;
				border-bottom: 1px solid #ddd;

				.spend {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.time {
					font-size: 24upx;
					color: #888;
					margin-top: 4px;
				}

				.money {
					position: absolute;
					right: 15upx;
					bottom: 15upx;
					color: #c30;

					text {
						font-size: 22upx;
					}

				}

			}
		}

	}
</style>
