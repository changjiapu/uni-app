<template>
	<view class="cashLog">
		<view class="title">
		<picker mode="date" :value="search_time" :start="startDate" :end="endDate" @change="bindDateChange" fields="month">
			<view class="uni-input">{{search_time}}</view>
		</picker>
		</view>
		<view class="main">
			<scroll-view scroll-y class="srx" v-if="list.length">
				<view class="item" :style="{ backgroundImage: 'url('+item.url_img+')' }" v-for="(item, index) in list" :key="index">
					<view>
						<text>&yen;{{item.getmoney}}</text>
						<text>{{ item.createtime }}</text>
					</view>
					<view>{{item.status}}</view>
				</view>
			</scroll-view>
			<empty-data v-else>没有发现相关记录</empty-data>
		</view>
	</view>
</template>

<script>
	import { cashLog } from '@/common/api/packageA'
	import { mapState } from 'vuex'
	export default {
		name: 'cashlog',
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				list: [],
				search_time: currentDate,
			}
		},
		computed: {
			...mapState(['userInfo']),
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList () {
				uni.showLoading()
				cashLog({ user_id:this.userInfo.id, search_time: this.search_time }).then(res => {
					uni.hideLoading()
					if (!res.data.code) {
						this.list = [...this.list, ...res.data.data.data]
					}
				})
			},
			bindDateChange: function(e) {
				this.search_time = e.target.value
				this.list = []
				this.getList()
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
				day = day > 9 ? day : '0' + day;

				return `${year}-${month}`;
			}
		}
	}
</script>

<style lang="less">
uni-body-page, page { height: 100%; }
.cashLog {
	height: 100%;
	display: flex;
	flex-direction: column;
	flex-flow: column;
	.title {
		height: 80upx;
		line-height: 80upx;
		font-size:26upx;
		padding: 0 15px;
		background:white;
	}
	.main {
		flex: 1;
		overflow: hidden;
		padding: 15upx 0;
		box-sizing: border-box;
		position: relative;
		.srx {
			height: 100%;
			.item {
				background-color:white;
				border-radius: 10px;
				margin: 0 20upx 15upx;
				padding: 15upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 22upx;
				background-repeat: no-repeat;
				background-position: 15px center;
				background-size: 40upx auto;
				padding-left: calc(50upx + 20px);
				& >view {
					&:first-of-type {
						display: flex;
						flex-direction: column;
						flex-flow: column;
						justify-content: space-between;
					}
				}
			}
		}
	}
}

</style>
