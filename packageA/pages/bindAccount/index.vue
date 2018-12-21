<template>
	<view class="account">
		<view class="title">已绑定账号</view>
		<view class="card" v-if="card.length">
			<radio-group @change="radioChange">
				<label class="item" v-for="(item, index) in card" :key="index">
					<navigator :url="'/pages/addDeposit/index?type='+item.type+'&action=update'" hover-class="none">
						<view>
							<view :style="{backgroundImage: 'url('+ item.images +')'}"></view>
							<view>
								<text>{{ item.name }}</text>
								<text>{{ item.phone }}</text>
							</view>
						</view>
						<view class="radio">
							修改
						</view>
					</navigator>
				</label>
			</radio-group>
		</view>
	</view>
</template>

<script>
export default {
	name: 'bindCard',
	data () {
		return {
			card: []
		}
	},
	onLoad(opt) {
		this.card = JSON.parse(opt.card)
	}
}
</script>

<style lang="less">
.account {
	.title {
		height: 80upx;
		line-height: 80upx;
		margin: 0 15px;
		font-size: 26upx;
	}
	.card {
		padding: 0 15px;
		background-color:white;
		.item {
			padding: 15upx 0;
			display: flex;
			justify-content: space-between;
			background: white;
			font-size: 22upx;
			border-bottom: 1px dashed #f1f1f1;
			box-sizing: border-box;
			position: relative;
			&::after {
				content: '';
				position: absolute;
				width: 15upx;
				height: 15upx;
				right: 0;
				top:50%;
				border-right:1px solid transparent;
				border-top: 1px solid transparent;
				border-color:#c7c7c7;
				transform: translateY(-50%) rotate(45deg);
			}
			&:last-of-type {
				border-bottom: none;
			}
			& > navigator {
				display: flex;
				justify-content: space-between;
				flex: 1;
				& > view {
					&:nth-of-type(1) {
						display: flex;
						align-items: center;
						& > view {
							&:nth-of-type(1) {
								width: 45upx;
								height: 45upx;
								margin-right: 20upx;
								background-repeat: no-repeat;
								background-size: contain;
								background-position: center center;
							}
							&:nth-of-type(2) {
								display: flex;
								flex-direction: column;
								flex-flow: column;
								& > text {
									&:last-of-type {
										color:#666
									}
								}
							}
						}
					}
				}
			}
			.radio {
				display: flex;
				align-items: center;
				padding-right: 20upx;
				color:#666
			}
		}
	}
}
</style>
