<template>
	<view class="myprofit">
		<block v-if="Info.usermoney">
			<view class="top">
				<view>
					<view class="total">&yen;{{ totoalMoney }}</view>
					<view class="control">
					<view @tap="rightDrawerVisible = true">全部</view> 
					 <!-- <view>查看报表</view> -->
					 <view>
					<picker mode="date" :value="params.time" :start="startDate" :end="endDate" @change="bindDateChange">
						<view>{{ params.time }}</view>
					</picker>
					</view>
					</view>
					<view class="num">
					<view>
						<text>待结算</text>
						<text>&yen;{{ Info.usermoney.total_profiy }}</text>
					</view>
					<view>
						<text>已结算</text>
						<text>&yen;{{ Info.usermoney.total_money }}</text>
					</view>
					</view>
				</view>
			</view>
			<view class="main">
				<scroll-view scroll-y class="srx" @scrolltolower="loadMove">
				<navigator :url="'/pages/profitDetail/index?batchcode='+item.batchcode+'&id='+item.id" hover-class="none" class="item" v-for="(item, index) in record" :key="index">
					<view class="name">{{ item.own_user_name }}</view>
					<view class="info">
						<view>{{ item.createtime }}</view>
						<view><uni-badge :text="item.paytype" :type="style[item.type]"></uni-badge> </view>
						<view class="price">&yen;{{ item.reward }}</view>
					</view>
				</navigator>
				</scroll-view>
				<empty-data v-if="noData && !record.length">没有发现相关记录</empty-data>
			</view>
			<uni-drawer class="draw" :visible="rightDrawerVisible" mode="right" @close="ToggleDrawer">
				<view>
					<view class="uni-card">
						<view class="uni-list">
							<block v-for="(list,index) in lists" :key="index">
								<view class="uni-list-cell uni-collapse">
									<view class="uni-list-cell-navigate uni-navigate-bottom" :class="list.show ? 'uni-active' : ''" @click="trigerCollapse(index)">
										{{list.title}}
									</view>
									<view class="uni-collapse-content" :class="list.show ? 'uni-active' : ''">
										<view v-if="list.type === 'list'">
											<view class="uni-list">
												<view  @tap="selectCate(item, idx)" :class="['uni-list-cell', {act: currentCate === idx}]" hover-class="none" v-for="(item, idx) in list.list" :key="idx">
													<view class="uni-list-cell-navigate uni-navigate-right">{{ item.name }}</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</block>
						</view>
					</view>
					<view class="btn"><button @tap="searchCate" type="warn" size="mini">确认</button></view>
				</view>
			</uni-drawer>
		</block>
		
	</view>
</template>

<script>
	import { MyProfit } from '@/common/api'
	import uniBadge from "@/components/uni-badge.vue"
	import uniDrawer from '@/components/uni-drawer'
	import { mapState } from 'vuex'
	export default {
		name: 'myprofit',
		components: { uniBadge, uniDrawer },
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				params: {
					type: 1,
					time: currentDate,
					page: 1,
					user_id: '',
				},
				noData: true,
				currentCate: 0,
				Info: {},
				record: [],
				style: {
					0: 'default',
					2: 'warning',
					9: 'danger'
				},
				rightDrawerVisible: true,
				lists: [
					{
						title: "分类",
						type: 'list',
						show: true,
						list: []
					}
				]
			}
		},
		onLoad() {
			this.params.user_id = this.userInfo.id
			this.getInfo()
		},
		methods: {
			searchCate () {
				this.params.page = 1
				this.record = []
				this.getInfo()
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value
			},
			bindDateChange: function(e) {
				this.params.time = e.target.value
				this.params.page = 1
				this.record = []
				this.noData = true
				this.getInfo()
			},
			bindTimeChange: function(e) {
				this.time = e.target.value
			},
			getInfo () {
				uni.showLoading()
				MyProfit(this.params).then(res => {
					uni.hideLoading()
					this.Info = res.data
					this.record = [ ...this.record, ...res.data.record ]
					this.lists[0].list = res.data.btnArray
					this.rightDrawerVisible = false
					if (!res.data.record.length) {
						this.noData = false
						if (this.params.page !== 1) {
							uni.showToast({
								title: '没有更多记录啦>_<',
								icon: 'none'
							})
						}
					}
				})
			},
			loadMove() {
				if (this.noData) {
					this.params.page++
					this.getInfo()
				}
			},
			getDate(type) {
				const date = new Date();

				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = 1;

				return `${year}-${month}-${day}`;
			},
			trigerCollapse(e) {
				for (let i = 0, len = this.lists.length; i < len; ++i) {
					if (e === i) {
						this.lists[i].show = !this.lists[i].show;
					} else {
						this.lists[i].show = false;
					}
				}
			},
			ToggleDrawer() {
				this.rightDrawerVisible = !this.rightDrawerVisible
			},
			selectCate(item, idx) {
				this.currentCate = idx
				this.params.type = item.id
			}
		},
		computed: {
			...mapState([
				'userInfo'
			]),
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			totoalMoney () {
				return (this.Info.usermoney.total_profiy + this.Info.usermoney.total_money).toFixed(2)
			}
		},
	}
</script>

<style lang="less">
page, uni-page-body, .myprofit {
	height: 100%;
	overflow: hidden;
}
.myprofit {
	display: flex;
	flex-direction: column;
	flex-flow: column;
}
.myprofit {
	.top {
		background-color:#0099ff;
		color:white;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 26upx;
		padding: 30upx 0;
		.total {
			font-size: 40upx;
		}
		.num {
			display: flex;
			justify-content: space-between;
			align-items: center;
			& > view {
				display: flex;
				flex-direction: column;
				flex-flow: column;
				& > text {
					
				}
			}
		}
		.control {
			display: flex;
			margin: 20upx 0;
			& > view {
					background: white;
					color: #03A9F4;
					border-radius: 16px;
					padding: 8px 22px;
					font-size: 12px;
					margin-right: 30upx;
					&:last-of-type {
						margin-right: 0;
					}
// 					&:nth-of-type(2) {
// 						margin: 0 20upx;
// 					}
			}
		}
	}
	.main {
		flex: 1;
		overflow: hidden;
		padding: 8px 0;
		box-sizing: border-box;
		position: relative;
		.srx {
			height: 100%;
			.item {
				background-color: white;
				border-radius: 10px;
				margin: 0 11px 8px;
				padding: 8px;
				position: relative;
				&::after {
					content: '';
					position: absolute;
					width: 15upx;
					height: 15upx;
					right: 20upx;
					top:50%;
					border-right:1px solid transparent;
					border-top: 1px solid transparent;
					border-color:#c7c7c7;
					transform: translateY(-50%) rotate(45deg);
				}
				&:last-of-type {
					margin-bottom: 0;
				}
				.name { font-size: 26upx;margin-bottom: 15upx;}
				.info {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 22upx;
					.price {
						color:#F44336;
						margin-right: 40upx;
					}
				}
			}
		}
	}
}	

</style>
