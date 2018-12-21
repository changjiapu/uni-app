<template>
<view class="record">
	<view class="tabs">
		<view>
			<view v-for="(item, index) in tabs" :class="{ act: currentTab === index }" :key="index" @click="change(item.type, index)">{{ item.name }}</view>
		</view>
	</view>
	<view class="main">
		<scroll-view v-if="list.length" ref="srx" scroll-y class="list" :scroll-top="srxTop" @scrolltolower="loadMove">
			<view class="item" v-for="(item, index) in list" :key="index">
				<view>
					<view class="title">{{ item.remark }}</view>
					<view class="dsc">{{ item.createtime }}</view>
				</view>
				<view>{{ !item.type ? '+' : '-' }}{{ item.money }}</view>
			</view>
		</scroll-view>
		<view class="no-data" v-if="!list.length && noData">
			<empty-data>暂无相关记录</empty-data>
		</view>
	</view>
</view>
</template>

<script>
import { CurrencyRecord } from '@/common/api/packageB'
import { mapState } from 'vuex'
export default {
	name: 'record',
	data() {
		return {
			currentTab: 0,
			srxTop:200,
			load: true,
			tabs: [
				{ name: '全部', type: 'moneybag_all' },
				{ name: '收入', type: 'moneybag_in' },
				{ name: '支出', type: 'moneybag_out' }
			],
			noData: false,
			list: [],
			params: {
				type: 'moneybag_all',
				page: 1,
				user_id: ''
			}
		}
	},
	onLoad() {
		this.params.user_id = this.userInfo.id
		console.log(this.userInfo.id)
		this.getList()
	},
	computed: {
		...mapState([
			'userInfo'
		])
	},
	methods: {
		change (type, idx) {
			this.list = []
			this.currentTab = idx
			this.params.type = type
			this.srxTop = 1
			this.params.page = 1
			this.getList()
			this.$nextTick().then(() => {
				this.srxTop = 0
			})
		},
		getList () {
			this.load = false
			CurrencyRecord(this.params).then(res => {
				if (!res.data.code) {
					if (res.data.data.length) {
						this.noData = false
						this.load = true
						this.list = [...this.list, ...res.data.data]
					} else {
						this.load = false
						this.noData = true
						if (this.params.page !== 1) {
							uni.showToast({
								icon: 'none',
								title: '没有更多数据啦>_<'
							})
						} 
					}
				}
			})
		},
		loadMove () {
			if (this.load) {
				this.params.page++
				this.getList()
			}
		}
	}
}
</script>

<style lang="less">
uni-page-body, page { height: 100%;}
.record {
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-flow: column;
	flex-direction: column;
	.tabs {
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		font-size: 26upx;
		& > view {
			display: flex;
			& > view {
				flex: 1;
				position: relative;
				&::after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 0;
					height: 2px;
					width: 100%;
					background-color:#E91E63;
					transform: scaleX(0);
					transition: transform .2s ease-in-out;
				}
				&.act {
					&::after {
						transform: scaleX(.8);
					}
				}
			}
		}
	}
	.main {
		flex: 1;
		overflow: hidden;
		background-color:#efefef;
		.list, .no-data {
			height: 100%;
			padding: 20upx 0;
			box-sizing: border-box;
			position: relative;
		}
		.list {
			.item {
				background-color:white;
				border-radius: 10px;
				margin: 0 20upx 15upx;
				padding: 15upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 26upx;
				& > view {
					&:first-of-type {
						& > .title {
							padding-bottom: 20upx;
						}
						& > .dsc {
							color: #6d6d6d;
							font-size: 22upx;
						}
					}
					&:last-of-type {
						color: #E91E63;
					}
				}
			}
		}
	}
}
</style>
