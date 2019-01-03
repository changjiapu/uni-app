<template>
	<view class="cashWay">
		 <view class="head">
			 <view>
				 <view class="avatar" :style="{backgroundImage: 'url('+ avatarURL +')'}"></view>
				 <view class="name">{{ userInfo.nickName }}</view>
				 <view class="level">
					 <view :style="{backgroundImage: 'url('+ list.cahs_logo +')'}">
					 {{ list.cash_name }}
					 </view>
				 </view>
			 </view>
		 </view>
		 <view class="list">
			 <scroll-view scroll-y class="srx">
				 <view class="contain">
					 <view class="money">
					 	<view><input type="text" placeholder="请输入提现金额" v-model.number="to_cash"></view>
						<button type="primary" size="mini" @tap="params.to_cash = list.balance">全部提现</button>
					 </view>
					 <view class="rule">
						 <checkbox-group @change="agree = !agree">
						 	<label>
						 		<checkbox :checked="agree"/>我已经阅读并同意
						 	</label>
							<text @tap="showAgre = true">《提现协议》</text>
						 </checkbox-group>
					 </view>
					 <view class="msg">总余额{{ list.allow_cash }}元，可以提现金额<text>{{ list.balance }}元</text>，到账金额<text>{{ toCash }}元</text></view>
					 <view class="btn">
						 <button @tap="Iagree" type="primary">提现</button>
					 </view>
				 </view>
			 </scroll-view>
		 </view>
		 <alert-rich :data="list.remark" v-if="showAgre" @on-close="showAgre = false"></alert-rich>
		 <key-board v-if="keyShow" @on-close="keyShow = false" @on-confrim="confirmCash"></key-board>
	</view>
</template>

<script>
	import { cash, cashMoney } from '@/common/api/packageA'
	import AlertRich from '@/components/richtext'
	import KeyBoard from '@/components/keyboard'
	import { mapState } from 'vuex'
	import { baseURL } from '@/common/utils/config'

	export default {
		name: 'myprivilege',
		components: { AlertRich, KeyBoard },
		data() {
			return {
				baseURL: baseURL,
				list: {},
				agree: false,
				showAgre: false,
				keyShow: false,
				to_cash: 0,
				params: {
					user_id: '',
					type: '',
					to_cash: 0,
					type: 0,
					pw: '',
					formId: '',
					appid: ''
				}
			}
		},
		onLoad(opt) {
			this.params.user_id = this.userInfo.id
			this.params.type = opt.type
			this.params.appid = this.appid
			this.getInfo()
		},
		methods: {
			getInfo () {
				uni.showLoading()
				cash(this.params).then(res => {
					uni.hideLoading()
					if (!res.data.code) {
						this.list = res.data.data
					}
				})
			},
			Iagree () {
				if (this.agree) {
					this.params.to_cash = this.toCash
					if (!this.params.to_cash) {
						uni.showModal({
							title: '',
							content: '请输入提现金额',
							showCancel: false
						})
					} else {
						this.keyShow = true
					}
				} else {
					uni.showModal({
						title: '',
						content: '请先阅读提现协议',
						showCancel: false
					})
				}
			},
			confirmCash (pw) {
				this.params.pw = pw
				uni.showLoading()
				cashMoney(this.params).then(res => {
					uni.hideLoading()
					this.keyShow = false
					if (!res.data.code) {
						uni.showModal({
							title: '',
							content: res.data.data,
							showCancel: false
						})
					} else {
						uni.showModal({
							title: '',
							content: res.data.msg,
							showCancel: false
						})
					}
				})
				
			}
		},
		computed: {
			...mapState([
				'userInfo'
			]),
			toCash () {
				return (this.to_cash * ((100 - this.list.callback_fee) / 100)).toFixed(2)
			},
			avatarURL () {
				const IMG = this.baseURL+'/weixinpl/shopping-temp/images/default.png'
				if(this.userInfo.avatarUrl) {
					return this.userInfo.avatarUrl === null ? IMG : this.userInfo.avatarUrl
				} else {
					return IMG
				}
			}
		},
		watch: {
			'params.to_cash': function(val, oldval) {
				if (val > +this.list.balance) {
					uni.showModal({
						title: '',
						content: '您的提现金额不能大于可提现金额',
						showCancel:false,
						complete: () => {
							this.to_cash = 0
						}
					})
				}
			}
		}
	}
</script>

<style lang="less">
uni-page-body, page { height: 100%;}	
.cashWay {
	display: flex;
	flex-flow: column;
	flex-direction: column;
	height: 100%;
	.head {
		background-color:#0099ff;
		color:white;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40upx 0;
		& > view {
			text-align: center;
			.avatar {
				background-repeat: no-repeat;
				background-size: cover;
				background-position: top center;
				width: 150upx;
				height: 150upx;
				border-radius: 50%;
				margin: 0 auto;
			}
			.name {
				margin: 15upx 0;
				font-size: 30upx
			}
			.level {
				font-size: 26upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 22upx;
				& > view {
					background-repeat: no-repeat;
					background-size: contain;
					background-position: left center;
					padding-left: 45upx;
					margin-right: 25upx;
					&:last-of-type {
						margin-right: 0;
					}
				}
			}
		}
	}
	.list {
		flex: 1;
		overflow: hidden;
		.srx {
			height: 100%;
			overflow: hidden;
			padding: 15upx 0;
			box-sizing: border-box;
			.contain {
				padding: 0 15px;
				.money {
					margin-bottom: 25upx;
					display: flex;
					justify-content: space-between;
					view {
						border-bottom:1px solid #f1f1f1;
						flex: 1;
						font-size: 26upx;
					}
					button {
						margin: 0 0 0 20upx;
						min-width: 80px;
					}
				}
				.msg {
					font-size: 22upx;
					padding: 15upx 20upx;
					background-color:#607D8B;
					color:white;
					border-radius: 15upx;
					text {
						color:#FFEB3B;
						font-weight: bold;
						font-size: 26upx;
						padding: 0 5upx;
					}
				}
				.btn {
					margin: 40upx 0;
				}
				.rule {
					margin-bottom: 30upx;
					font-size: 26upx;
					display: flex;
					align-items: center;
					text {
						color:#1e90ff;
					}
				}
			}
		}
	}
}	
</style>
