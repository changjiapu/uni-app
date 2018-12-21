<template>
	<view class="setPassword">
		<view class='current-action'>
			<view class='cont' v-if="crrent_action===0">一、请输入支付密码确认身份</view>
			<view class='cont' v-if="crrent_action===1">二、请设置6位支付密码</view>
			<view class='cont' v-if="crrent_action===2">三、请再次输入</view>
		</view>
		<!-- 密码框 -->
		<view class='password-input'>
			<view>
				<text :style="{display:action_list[crrent_action].password[0]?'':'none'}"></text>
			</view>
			<view>
				<text :style="{display:action_list[crrent_action].password[1]?'':'none'}"></text>
			</view>
			<view>
				<text :style="{display:action_list[crrent_action].password[2]?'':'none'}"></text>
			</view>
			<view>
				<text :style="{display:action_list[crrent_action].password[3]?'':'none'}"></text>
			</view>
			<view>
				<text :style="{display:action_list[crrent_action].password[4]?'':'none'}"></text>
			</view>
			<view>
				<text :style="{display:action_list[crrent_action].password[5]?'':'none'}"></text>
			</view>
		</view>
		<!-- 操作提示 -->
		<view class='current-action-tips'>
			<view class='forget-password' v-if="crrent_action===0">忘记密码?</view>
			<view class='password-tips' v-else>请不要设置重复、连续的数字作为密码</view>
		</view>
		<!-- 键盘 -->
		<view class='keyboard'>
			<view class='left number'>
				<view hover-class='active' :hover-stay-time=100 @click='InputPassword(1)'>1</view>
				<view hover-class='active' :hover-stay-time=100 @click='InputPassword(2)'>2</view>
				<view hover-class='active' :hover-stay-time=100 @click='InputPassword(3)'>3</view>
				<view hover-class='active' :hover-stay-time=100 @click='InputPassword(4)'>4</view>
				<view hover-class='active' :hover-stay-time=100 @click='InputPassword(5)'>5</view>
				<view hover-class='active' :hover-stay-time=100 @click='InputPassword(6)'>6</view>
				<view hover-class='active' :hover-stay-time=100 @click='InputPassword(7)'>7</view>
				<view hover-class='active' :hover-stay-time=100 @click='InputPassword(8)'>8</view>
				<view hover-class='active' :hover-stay-time=100 @click='InputPassword(9)'>9</view>
				<view hover-class='active' :hover-stay-time=100 @click='InputPassword(X)'>X</view>
				<view hover-class='active' :hover-stay-time=100 @click='InputPassword(0)'>0</view>
				<view hover-class='active' :hover-stay-time=100 @click='InputPassword()'>.</view>
			</view>
			<view class='right ctr-btn'>
				<view class='ctr-btn-item' hover-class='active' :hover-stay-time='100' @click='clear'>
				</view>
				<view class='ctr-btn-item' hover-class='active' :hover-stay-time='100' >OK</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		paySet,
		payPass
	} from '@/common/api'
	export default {
		name: 'setPwd',
		data() {
			return {
				password: '',
				crrent_action: 0,
				action_list: []
			};
		},
		onLoad() {
			paySet({
				user_id: this.userInfo.id
			}).then(res => {
				if (res.data.code) {
					this.password = res.data.mge
				} else {
					this.crrent_action = 1
				}
			})
			var action_list = [];

			for (var i = 0; i < 3; i++) {
				var obj = {};
				obj.status = 0; //状态
				obj.password = []; //用户输入的密码
				obj.max_len = 6; //最大的位数
				action_list.push(obj);
			}
			this.action_list = action_list;
		},
		methods: {
			InputPassword(e) {
				if (e == undefined) {
					var key = '.'
				}
				var key = e,
					crrent_action = this.crrent_action,
					action_list = this.action_list;
				if (action_list[crrent_action].password.length < action_list[crrent_action].max_len) {
					action_list[crrent_action].password = action_list[crrent_action].password + key;
					this.action_list = action_list
					if (action_list[crrent_action].password.length == action_list[crrent_action].max_len) {
						this.actions()[crrent_action]();
					}
				}
			},
			actions() {
				var crrent_action = this.crrent_action,
					action_list = this.action_list,
					_this = this;
				//crrent_action==0
				function action_0() {
					console.log(action_list[0].password)
					console.log(_this.password)
					if (action_list[0].password == _this.password) {
						_this.crrent_action = 1
					} else {
						uni.showModal({
							showCancel: false,
							title: '提示',
							content: '输入密码错误!',
							success: function(res) {
								action_list[0].password = '';
								_this.action_list = action_list
							}
						})
					}
				}
				//crrent_action==1
				function action_1() {
					console.log(555)
					_this.crrent_action = 2
				}
				//crrent_action==2
				function action_2() {
					if (action_list[2].password == action_list[1].password) {
						var sendData = {
							user_id: _this.userInfo.id,
							password: action_list[2].password
						}
						payPass(sendData).then(res => {})
						uni.showToast({
							title: '设置成功',
							duration: 1500
						})
						setTimeout(function() {
							uni.navigateBack({
								delta: 1
							})
						}, 1500);
					} else {
						uni.showModal({
							showCancel: false,
							title: '提示',
							content: '两次输入密码不一致!',
							success: (res) => {
								action_list[2].password = '';
								_this.action_list = action_list
							}
						})
					}
				}

				return [action_0, action_1, action_2]
			},
			clear() {
				var crrent_action = this.crrent_action,
					action_list = this.action_list;
				var index = action_list[crrent_action].password.length;
				if (index > 0) {
					action_list[crrent_action].password = action_list[crrent_action].password.substr(0, index - 1);
						this.action_list=action_list
				}
			},
		},
		computed: {
			...mapState([
				'userInfo',
			])
		}
	}
</script>

<style lang="less" scoped>
	@import '../../common/css/variables.less';
	page {
		background-color: #f6f6f6;
	}

	.setPassword {
		.current-action {
			height: 200rpx;
			background-color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 34rpx;
			word-spacing: 1px;
		}

		.password-input {
			display: flex;
			width: 660rpx;
			border: 1px solid #ddd;
			margin: 0 auto;
			margin-top: 50rpx;
			background-color: #fff;
			border-radius: 3px;

			view {
				width: 110rpx;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
				border-right: 1px solid #ccc;

				&:last-of-type {
					border-right: none;
				}

				text {
					width: 6px;
					height: 6px;
					border-radius: 50%;
					background-color: #333;
				}
			}
		}

		.current-action-tips {
			display: flex;
			justify-content: center;
			font-size: 26rpx;
			margin-top: 12px;

			.forget-password {
				color: #06f;
			}

			.password-tips {
				color: #888;
			}
		}

		.keyboard {
			width: 100%;
			display: flex;
			background-color: #fff;
			border-top: 1px solid #eee;
			position: fixed;
			bottom: 0;

			.number {
				display: flex;
				width: 570rpx;
				flex-wrap: wrap;

				view {
					width: 190rpx;
					height: 120rpx;
					line-height: 120rpx;
					text-align: center;
					font-size: 46rpx;
					font-weight: bold;
					box-sizing: border-box;
					border-right: 1px solid #eee;
					border-bottom: 1px solid #eee;
				}

			}

			.ctr-btn {
				width: 180rpx;

				view {
					height: 240rpx;
					line-height: 240rpx;
					text-align: center;
					box-sizing: border-box;
					border-bottom: 1px solid #eee;

					&:first-of-type {
						background-repeat: no-repeat;
						background-position: center;
						background-size: 50upx 50upx;
						background-image: url("@{URL}/weixinpl/shopping-temp/images/backspace.svg");
					}

					&:nth-child(2) {
						font-size: 46rpx;
						color: #c30;
					}
				}
			}

			.active {
				background-color: #E4E7ED;
			}
		}
	}
</style>
