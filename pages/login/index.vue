<template>
	<view class="login">
		<view class="main" :style="{ height: screenHeight + 'px' }">
			<view class="contain">
				<view class="form">
					<view class="line">
						<input type="text" v-model="params.uname" placeholder-style="color:#c7c7c7" placeholder="请输入手机号码"/>
					</view>
					<view class="line">
						<input type="password" v-model="params.pwd" placeholder-style="color:#c7c7c7" placeholder="请输入密码">
					</view>
					<view class="btn" @click="login">登录</view>
					<view class="control">
						<navigator hover-class="none" url="/pages/resetPwd/index">忘记密码</navigator>
						<navigator v-if="isRegister" hover-class="none" url="/pages/Register/index">立即注册</navigator>
					</view>
				</view>
				<view class="third">
					<view class="cut">
						<text>其他方式登录</text>
					</view>
					<view class="other">
						<view class="weixin" @click="$store.dispatch('WeiXinLogin', { callback: callback, referrer: referrer })"></view>
					</view>
				</view>
			</view>
			<view class="alert" v-if="show">
				<view class="statusbar"></view>
				<view class="input">
					<view class="title">请输入推荐人ID</view>
					<view class="id">
						<input type="text" v-model="referrer" placeholder="请输入推荐人ID">
					</view>
					<view class="control"><button type="default" size="mini" @tap="show = false">取消</button><button @tap="wxLogin" type="primary" size="mini">确认</button></view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		name: 'Login',
		data() {
			return {
				Login: true,
				time: 0,
				show: false,
				referrer: '',
				screenHeight: 0,
				params: {
					uname: '',
					pwd: ''
				}
				
			};
		},
		onLoad () {
			this.screenHeight = uni.getSystemInfoSync().windowHeight
		},
		methods: {
			login () {
				this.pwd = false
				this.isPhone(this.params, res => {
					this.$store.dispatch('userLogin', res).then(res => {
						if (res) {
							uni.redirectTo({
								url: '/pages/index/index'
							})
						} else {
							uni.showModal({
								title: '',
								content: '用户名或密码错误',
								showCancel: false
							})
						}
					})
				})
			},
			wxLogin () {
				this.show = false
				this.$store.dispatch('WeiXinLogin', { callback: this.callback, referrer: this.referrer })
			},
			callback (tag) {
				if (tag) {
					this.show = tag
				} else {
					return this.referrer
				}
			},
			isPhone (data, callback) {
				const reg = /^[1][3,4,5,7,8][0-9]{9}$/
				if (reg.test(this.params.uname)) {
					callback(data)
				} else {
					uni.showModal({
						title:'',
						content: '请输入正确的手机号码',
						showCancel: false
					})
				}
			}
		},
		computed: {
			...mapState([
				'isRegister',
				'userInfo'
			])
		}
	}
</script>

<style lang="less">
	@import '../../common/css/variables.less'; 
uni-page-body, page, .login { min-height: 100%;overflow: hidden;height: 100%;}	
.login {
	background-color:white;
	.main {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		.contain {
			width: 80%;
			.form {
				& > .line {
					position: relative;
					color: #333;
					background-repeat: no-repeat;
					background-size: 40upx 40upx;
					background-position: left center;
					padding: 15upx 0 15upx 60upx;
					margin-bottom: 20upx;
					&::after {
						content: '';
						position: absolute;
						left: 0;
						bottom: 0;
						border-top: 1px solid #dcdcdc;
						width: 100%;
					}
					&:first-of-type {
						background-image: url("@{URL}/weixinpl/shopping-temp/images/login_user.png");
					}
					&:nth-of-type(2) {
						background-image: url("@{URL}/weixinpl/shopping-temp/images/login_pwd.png");
					}
				}
				& > .btn {
					background-color:#ed5851;
					color:white;
					border-radius: 40upx;
					text-align: center;
					font-size: 30upx;
					padding: 25upx 0;
					margin: 60upx 0 0 0;
					&.act {
						background-color:rgba(237,88,81,.5);
					}
				}
				& > .control {
					display: flex;
					color:#c7c7c7;
					font-size: 22upx;
					justify-content: space-between;
					& > navigator {
						padding: 15upx 25upx;
						margin: 20upx 0;
						&:nth-of-type(1) {
							text-decoration: underline;
							color:#0066cb;
						}
						&:nth-of-type(2) {
							background:#0099ff;
							color:white;
							border-radius: 30upx;
						}
					}
				}
			}
				.third {
				margin-top: 200upx;
					.cut {
						color:#a4a4a4;
						text-align: center;
						position: relative;
						& > text { font-size: 22upx; }
						&::before { left: 0 }
						&::after { right: 0 }
						&::before,&::after {
							position: absolute;
							width: 30%;
							height: 1px;
							background: #dfdfdf;
							content: '';
							top: 50%;
							margin-top: 2px;
						}
					}
					.other {
						display: flex;
						justify-content: center;
						margin-top: 20upx;
						& > view {
							width: 120upx;
							height: 120upx;
							border-radius: 100%;
							background-repeat: no-repeat;
							background-position: center center;
							&.weixin {
								background-image: url("@{URL}/weixinpl/shopping-temp/images/login_weixin.png");
								background-size: 120upx 120upx;
							}
						}
					}
				}			
		}
		.alert {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 33;
			display: flex;
			justify-content: center;
			align-items: center;
			.statusbar {
				z-index: 44;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgba(0,0,0,.6);
			}
			.input {
				z-index: 55;
				background-color:white;
				padding: 30upx;
				border-radius: 15upx;
				box-sizing: border-box;
				width: 70%;
				.title {
					text-align: center;
					font-size: 28upx;
					box-sizing: border-box;
				}
				.id {
					padding: 10upx 15upx;
					margin: 30upx 0;
					border:1px solid #f1f1f1;
					border-radius: 20upx;
					font-size: 22upx;
					
				}
				.control {
					display: flex;
					justify-content: space-between;
				}
			}
		}
	}
}
</style>
