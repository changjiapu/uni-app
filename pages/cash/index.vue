<template>
	<view class="cashList">
		<view class="card" v-if="card.length">
			<radio-group @change="radioChange">
				<label class="item" v-for="(item, index) in card" :key="index">
					<view>
						<view :style="{backgroundImage: 'url('+ item.images +')'}"></view>
						<view>
							<text>{{ item.name }}</text>
							<text>{{ item.phone }}</text>
						</view>
					</view>
					<view class="radio">
						<radio :value="item.type" :checked="item.checked" />
					</view>
				</label>
			</radio-group>
		</view>
		<view class="list" v-if="payList.length">
			<view class="title">其他提现方式</view>
			<view class="pay">
				<view @tap="toBind(item.type)" :style="{backgroundImage: 'url('+item.images+')'}" class="item" v-for="(item, index) in payList" :key="index">
					<view>{{ item.name }}</view>
					<view>{{ item.bind }}</view>
				</view>
			</view>
		</view>
		<view class="control">
			<button type="default" size="mini" @tap="cashLog">提现记录</button>
			<button type="primary" size="mini" @tap="mAccount">提现账号管理</button>
			<button type="warn" size="mini" @tap="cash">确认提现账号</button>
		</view>
	</view>
</template>

<script>
	import { MoneyCash } from '@/common/api'
	import { mapState } from 'vuex'
	export default {
		name:'cashlist',
		data() {
			return {
				payList: [],
				card: [],
				user_id: '',
				params: {
					name: '',
					type: ''
				},
				is_allow:1
			}
		},
		onLoad() {
			this.user_id = this.userInfo.id
		},
		onShow() {
			this.getList()

		},
		deactivated() {
			this.params.name = ''
			this.params.type = ''
		},
		methods: {
			getList () {
				const user_id = this.user_id
				uni.showLoading()
				MoneyCash({ user_id }).then(res => {
					uni.hideLoading()
					if (!res.data.code) {
						this.payList = res.data.data.bind
						this.is_allow=res.data.data.is_allow
						res.data.data.data.forEach(item => { 
							item.checked = false
							item.type = item.type.toString()
						})
						this.card = res.data.data.data
						if (!res.data.data.data.length) {
							uni.showModal({
								title: '',
								content: '您还没有任何提现方式，请先绑定提现方式才能提现！',
								showCancel:false
							})
						}
					}
				})
			},
			toBind (type) {
				if ([1,4].includes(type)) {
					uni.navigateTo({
						url: `/pages/addDeposit/index?type=${type}&action=add`
					})
				}
			},
			cashLog () {
				uni.navigateTo({
					url: '/packageA/pages/cashLog/index'
				})
			},
			mAccount () {
				if (this.card.length) {
					uni.navigateTo({
						url: `/packageA/pages/bindAccount/index?card=${JSON.stringify(this.card)}`
					})
				} else {
					uni.showModal({
						title: '',
						content: '您还没有绑定账号',
						showCancel: false
					})
				}
			},
			radioChange(e) {
				const card = this.card
				card.forEach(item => {
					item.checked = item.type === e.detail.value
					if (item.type === e.detail.value) {
						this.params.type = item.type
						this.params.name = item.name
					}
				})
				this.card = card
			},
			cash () {
				if (this.params.type) {
					if(!this.is_allow){
						uni.showModal({
							title: '',
							content: '尚未满足提现条件或不在提现时间段',
							showCancel: false
						})
					} else {
						uni.navigateTo({
							url: `/packageA/pages/cashWay/index?name=${this.params.name}&type=${this.params.type}`
						})
					}
				} else {
					uni.showToast({
						title: '请选择提现方式',
						icon: 'none'
					})
				}
			}
		},
		computed:{
			...mapState([
				'userInfo'
			])
		}
	}
</script>

<style lang="less">
.cashList {
	.card {
		padding: 0 15px;
		background-color:white;
		margin-bottom: 10px;
		.item {
			padding: 15upx 0;
			display: flex;
			justify-content: space-between;
			background: white;
			font-size: 22upx;
			border-bottom: 1px dashed #f1f1f1;
			box-sizing: border-box;
			&:last-of-type {
				border-bottom: none;
			}
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
			.radio {
				display: flex;
				align-items: center;
			}
		}
	}
	.list {
		z-index: 3;
		bottom: 0;
		background-color:white;
		font-size: 30upx;
		padding: 0;
		box-sizing: border-box;
		overflow: hidden;
		.title {
			text-align: center;
			height: 80upx;
			line-height: 80upx;
			font-size: 28upx;
		}
		.pay {
			box-sizing: border-box;
			border-top:1px solid #f1f1f1;
			padding: 0 15px;
			overflow: hidden;
			display: block;
			.item {
				padding: 25upx 0 25upx 50upx;
				position: relative;
				font-size: 24upx;
				background-repeat:no-repeat;
				background-size: 40upx 40upx;
				background-position: left center;
				background-color:white;
				text-align: left;
				line-height: 1.4;
				border: none;
				display: flex;
				justify-content:space-between;
				& > view {
					&:last-of-type {
						color:#666;
						padding-right: 25upx;
					}
				}
				&:last-of-type {
					&::after {
						display: none;
					}
				}
				&::before {
					content: '';
					position: absolute;
					top: 50%;
					right:0;
					width: 15upx;
					height: 15upx;
					transform: translate(0,-50%) rotate(45deg);
					border-top: 1px solid #999;
					border-right:1px solid #999;
				}
				&::after {
					content:'';
					position: absolute;
					height: auto;
					bottom: 0;
					left: 0;
					width: 100%;
					border-style: dashed;
					border-width: 1px 0 0 0;
					border-color: #f1f1f1;
					transform: scale(1);
					border-radius: 0;
					top: auto;
				}
			}
		}
	}
	.control {
		display: flex;
		justify-content: space-between;
		margin: 30upx 0;
	}
}
</style>
