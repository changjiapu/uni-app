<template>
	<view class="profit_detail">
		<view class="top">
			<text>佣金金额</text>
			<text>&yen;{{ data.reward }}</text>
		</view>
		<view>
			<text>类型</text>
			<text>{{ data.type }}</text>
		</view>
		<view>
			<text>时间</text>
			<text>{{ data.createtime }}</text>
		</view>
		<view>
			<text>交易单号</text>
			<text>{{ data.batchcode }}</text>
		</view>
		<view>
			<text>买家</text>
			<text>{{ data.weixin_name }}</text>
		</view>
		<view>
			<text>状态</text>
			<text>{{ data.paytype }}</text>
		</view>
		<view>
			<text>备注</text>
			<text>{{ data.remark }}</text>
		</view>
	</view>
</template>

<script>
	import { profitDetail } from '@/common/api'
	export default {
		data() {
			return {
				params: {},
				data: {}
			};
		},
		onLoad(opt) {
			this.params.id = opt.id
			this.params.batchcode = opt.batchcode
			this.getInfo()
		},
		methods: {
			getInfo () {
				uni.showLoading()
				profitDetail(this.params).then(res => {
					uni.hideLoading()
					this.data = { ...this.data, ...res.data }
				})
			}
		}
	}
</script>

<style lang="less">
.profit_detail {
	& > view {
		display: flex;
		justify-content: space-between;
		padding: 20upx 15px;
		font-size: 26upx;
		background:white;
		position: relative;
		&.top {
			margin-bottom: 10px;
			text {
				&:last-of-type {
					color:red;
					font-weight: bold;
				}
			}
		}
		text {
			&:first-of-type {
				width: 120upx;
				text-align: justify;
				text-align-last: justify;				
			}
			&:last-of-type {
				color:#666
			}
		}
		&:not(.top) {
			&::after {
				content:'';
				position: absolute;
				bottom: 0;
				left: 15px;
				right: 15px;
				border-top:1px solid #f1f1f1;
				transform: scaleY(.5);
			} 
			&:last-of-type {
				&::after {
					display: none;
				}
			}
		}
	}
}
</style>
