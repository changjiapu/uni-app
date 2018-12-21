<template>
	<view class="payList">
		<view class="title">
			<view>订单金额</view>
			<view class="money">{{ option.price }}</view>
		</view>
		<view class="list">
			<form :report-submit="true" @submit="PayWay">
				<button formType="submit" class="btn" hover-class="none" v-for="(i, idx) in list" :key="idx">
					<view class="item">
						<view :class="['img', { vip: i.id === 1, balance: i.id === 3, weixin: i.id === 4}]"></view>
						<text>{{ i.name }}</text>
						<input hidden :name="'id'" :value="i.name" type="text">
					</view>
				</button>
			</form>
		</view>
		<view class="model" v-if="keyShow">
			<view class="statubar" @click="keyShow = !keyShow"></view>
			<view class="main">
				<view class='password-input'>
					<view v-for="(i, idx) in 6" :key="i"><view :class="{act: idx < password.length}"></view></view>
				</view>
				<!-- 键盘 -->
				<view class='keyboard'>
					<view class='left number'>
						<view v-for="(i, o) in key.code.length" :key="o">
							<view v-for="(m, idx) in key.code[o]" :key="idx" hover-class='active' :hover-stay-time='100' @click="InputPwd(m)">{{ m }}</view>
						</view>
					</view>
					<view class='right ctr-btn'>
						<view v-for="(c, idx) in key.control" :key="idx" class='ctr-btn-item' hover-class='active' :hover-stay-time='100' @click="control(c)">{{ c }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { payList, getPwd, PayMoney } from '@/common/api/packageB'
	export default {
		name: 'articlePay',
		data() {
			return {
				option: {},
				list: [],
				keyShow: false,
				password:'',
				originalPwd: '',
				key: {
					code: [[1,2,3],[4,5,6],[7,8,9],['x',0,'.',]],
					control: ['', '取消']
				},
				payParams: {
					formId: 0,
					batchcode: 0,
					pay_id: 0,
					paystyle: '',
					type: 0,
					total_price: 0
				}
			};
		},
		onLoad(option) {
			this.option = option
			this.getList()
			this.payParams.type = option.type
			this.total_price = option.price
			this.batchcode = option.batchcode
		},
		methods: {
			getList () {
				payList().then(res => {
					if (!res.data.code) this.list = res.data.data
					getPwd().then(res => {
						if (res.data.code) this.originalPwd = res.data.mge
					})
				})
			},
			InputPwd(key) {
				if (this.password.length !== 6) this.password += key
				
			},
			PayWay (e) {
				console.log(e)
				this.keyShow = true
// 				this.payParams.pay_id = item.id
// 				this.payParams.paystyle = item.paystyle
			},  
			control (event) {
				switch (event) {
					case '':
					this.password = this.password.substr(0, this.password.length - 1)
					break
					case '取消':
					this.keyShow = false
					break
				}
			},
			toPay (data) {
				
			}
		},
		watch: {
			password: function(val, oldval) {
				if (val.length === 6) {
					if (this.password !== this.originalPwd) {
						uni.showModal({
							title: '',
							content: '密码错误',
							success: (type) => {
								if (type.confirm) {
									this.password = ''
								}
							}
						})
					} else {
						uni.showModal({
							title: '',
							content: '支付成功',
							showCancel: false
						})
				   }
				}
			},
			keyShow: function(val, oldval) {
				if (!val) this.password = ''
			}
		}
	}
</script>

<style lang="less">
@import '../../../common/css/variables.less';	
uni-page-body, page { height: 100%;}
.payList {
	height: 100%;
	overflow: hidden;
	.title {
		padding: 0 15px;
		font-size: 26upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
		border-bottom: 1px solid #e8e8e8;
		.money {
			background-repeat: no-repeat;
			background-size: contain;
			background-position: left center;
			background-image: url("@{URL}/weixinpl/shopping-temp/images/price.png");
			padding-left: 45upx;
			color:#ef6153
		}
	}
	.list {
	    padding:0 15px;
		font-size: 28upx;
		.btn {
			background:none;
			padding:0;
			margin: 0;
			&:after { border:none }
			.item {
				padding: 10upx 0;
				border-bottom:1px solid #e8e8e8;
				display:flex;
				align-items:center;
				position:relative;
				.img {
					padding-top: 55upx;
					width: 55upx;
					margin-right: 15upx;
					background-repeat: no-repeat;
					background-size: contain;
					background-position: left center;
					&.vip {
						background-image: url("@{URL}/weixinpl/shopping-temp/images/pay_vip.png");
					}
					&.balance {
						background-image: url("@{URL}/weixinpl/shopping-temp/images/price.png");
					}
					&.weixin {
						background-image: url("@{URL}/weixinpl/shopping-temp/images/weixin_pay.png");
					}
				}
				&::after {
					content: '';
					position: absolute;
					width: 15upx;
					height: 15upx;
					right: 10upx;
					top:50%;
					border-right:1px solid transparent;
					border-top: 1px solid transparent;
					border-color:#c7c7c7;
					transform: translateY(-50%) rotate(45deg);
				}
			}
		}
	}
	.model {
		height: 100%;
		position: fixed;
		width: 100%;
		top:0;
		left: 0;
		display: flex;
		align-items: flex-end;
		.statubar {
			height: 100%;
			width: 100%;
			position: fixed;
			top: 0;
			left:0;
			background:rgba(0,0,0,.5);
			z-index: 88;
		}
		.main {
			position: relative;
			z-index: 99;
			background:white;
			width: 100%;
			.password-input {
				display: flex;
				width: 90%;
				border: 1px solid #ddd;
				margin: 0 auto;
				margin-top: 50upx;
				background-color: #fff;
				border-radius: 3px;
				view {
					flex: 1;
					border-right: 1px solid #ccc;
					position: relative;
					& > view {
						width: 100%;
						padding-top: 100%;
						&.act {
							&::after {
								display: flex;
								align-items: center;
								justify-content: center;
								box-sizing: border-box;
								content: '\2022';
								position: absolute;
								width: 100%;
								height: 100%;
								top: 0;
								left: 0;
								font-size: 52upx;
							}
						}
					}
					&:nth-child(6) {
						border: none;
					}
				}
			}
			.keyboard {
				width: 100%;
				display: flex;
				background-color: #fff;
				border-top: 1px solid #eee;
				margin-top: 50upx;
				.number {
					display: flex;
					flex: 1;
					flex-decration: column;
					flex-flow:column;
					border-right:1px solid #eee;
					box-sizing: border-box;
					view {
						flex: 1;
						display: flex;
						& > view {
							flex: 1;
							align-items: center;
							justify-content: center;
							border-bottom:1px solid #eee;
							border-right:1px solid #eee;
							box-sizing: border-box;
							&:nth-of-type(3n) {
								border-right: 0
							}
						}
						&:last-of-type{
							& > view {
								border-bottom: 0;
							}
						}
						
					}
				}
				.ctr-btn {
					width: 180upx;
					view {
						height: 240upx;
						line-height: 240upx;
						text-align: center;
						box-sizing: border-box;
						border-bottom: 1px solid #eee;
						.iconfont {
							font-size: 44upx !important;
							color: #c30;
						}
						&:nth-child(1) {
							background-repeat: no-repeat;
							background-position: center center;
							background-size: 50upx 50upx;
							background-image: url("@{URL}/weixinpl/shopping-temp/images/backspace.svg");
						}
						&:nth-child(2) {
							font-size: 30upx;
							color: #c30;
						}
					}
				}
				.active { background-color: #e4e7ed; }
			}
		}
	}
}
</style>
