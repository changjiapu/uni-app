<template>
	<view class="reset">
		<view class="list">
			<view class="line">
				<view>
					<view>
						<text>手机号码</text>
						<input type="text" v-model="params.phone" placeholder="请输入手机号码"/>
					</view>
					<view>
						<text>验证码</text>
						<view>
							<input class="code" type="text" v-model="params.verifycode" placeholder="请输入验证码"/>
							<button @click="GetCodes" class="getcode" :disabled="getCode" type="primary" hover-class="none" size="mini">
								{{ time !== 0 ? time + 's' : '获取验证码' }}
							</button>
						</view>
					</view>
					<view>
						<text>新密码</text>
						<input type="password" v-model="params.password" placeholder="请输入新密码">
					</view>
					<view>
						<text>确认密码</text>
						<input type="password" v-model="params.confirm_pw" placeholder="请确认新密码">
					</view>
				</view>
			</view>
			<view class="btn">
				<button type="warn" :disabled="disabled" @click="ReSet">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { sendPhoneMsg } from '@/common/api'
	import { ResetPwd } from '@/common/api/login'
	
	export default {
		name: 'reset',
		data() {
			return {
				time: 0,
				getCode: false,
				disabled: false,
				params: {
					phone: '',
					password: '',
					verifycode: '',
					confirm_pw: ''
				}
			}
		},
		methods: {
			ReSet () {
				this.isPhone(this.params, res => {
					if (this.code === res.verifycode) {
						if (res.password === res.confirm_pw) {
							ResetPwd(res).then(rst => {
								if (rst.data.code === 'ok') uni.redirectTo({
									url: '/pages/login/index'
								})
							})
						} else {
							uni.showModal({
								title: '',
								content: '两次密码输入不一致',
								showCancel: false
							})
						}
					} else {
						uni.showModal({
							title: '',
							content: '请输入正确的验证码',
							showCancel: false
						})
					}
				})
			},
			GetCodes () {
				this.isPhone({ phone: this.params.phone, action: 1 }, res => {
					sendPhoneMsg(res).then(res => {
						if (!res.data.code) {
							this.getCode = true
							this.time = 60
							let timer = setInterval(() => {
								this.time--
								if (!this.time) {
									clearInterval(timer)
									this.time = 0
									this.getCode = false
								}
							}, 1000)
							this.code = res.data.mcode
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							})
						}
					})
				})
			},
			isPhone (data, callback) {
				const reg = /^[1][3,4,5,7,8][0-9]{9}$/
				if (reg.test(this.params.phone)) {
					callback(data)
				} else {
					uni.showModal({
						title:'',
						content: '请输入正确的手机号码',
						showCancel: false
					})
				}
			}
		}
	}
</script>

<style lang="less">
.reset {
	.list {
		.line {
			& > view {
				padding: 0 15px;
				background-color:white;
				& > view {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 20upx 0;
					position: relative;
					&:last-of-type {
						&::after {
							display: none;
						}
					}
					&::after {
						position: absolute;
						content: '';
						border-bottom: 1px solid #f3f3f3;
						left: 0;
						bottom: 0;
						width: 100%;
					}
					& > text { font-size: 26upx;width: 120upx;text-align: justify;text-align-last:justify;padding-right: 30upx; }
					& > view, & > navigator { flex: 1;padding: 5upx 0; font-size: 26upx; color:#999;
					}
					& > view { 
						flex: 1;
						font-size: 26upx;
						color:#999;
						display: flex;
						justify-content: space-between;
						align-items: center;
						& > button { margin-right: 0; }
						.code {width: 200upx}
						& > button { margin-right: 0;min-width:110px; }
					}
					& > input { font-size: 26upx;flex: 1;}
				}
			}
		}		
	}
	.btn {
		margin: 60upx 15px 0;
	}
}
</style>
