<template>
	<view class="userInfo">
		<view class="list">
			<view class="line">
				<view>
					<view>
						<text>上级ID</text>
						<input type="text" v-model="id.referrer" placeholder="上级用户ID(没有不填)"/>
					</view>
					<view>
						<text>手机号码</text>
						<input type="text" v-model="params.phone" placeholder="请输入手机号码"/>
					</view>
					<view>
						<text>验证码</text>
						<view>
							<input class="code" type="text" placeholder="手机验证码" v-model="params.verifycode"/>
							<button @click="GetCodes" class="getcode" :disabled="getCode" type="primary" hover-class="none" size="mini">
								{{ time !== 0 ? time + 's' : '获取验证码' }}
							</button>
						</view>
					</view>
					<view>
						<text>性别</text>
						<view>
							<view class="sex">
								<view @click="params.sex = 1" :class="{act: params.sex}"><text>男</text></view>
								<view @click="params.sex = 0" :class="{act: !params.sex}"><text>女</text></view>
							</view>
						</view>
					</view>
					<view>
						<text>用户名</text>
						<input type="text" v-model="params.name" placeholder="请输入用户名"/>
					</view>
					<view>
						<text>密码</text>
						<input type="password" v-model="params.password" placeholder="请输入密码"/>
					</view>
					<view>
						<text>确认密码</text>
						<input type="password" v-model="params.repwd" placeholder="请确认密码"/>
					</view>
				</view>
			</view>
		</view>
		<view class="btn">
			<button type="warn" :disabled="disabled" @click="ReGister">提交</button>
		</view>
	</view>
</template>

<script>
	import { Register } from '@/common/api/login'
	import { sendPhoneMsg } from '@/common/api'

	export default {
		name: 'register',
		data() {
			return {
				time: 0,
				disabled: true,
				getCode: false,
				code: '',
				id: {
					referrer: '',
				},
				params: {
					phone: '',
					verifycode : '',
					name: '',
					password: '',
					repwd: '',
					sex: 1
				}
			}
		},
		watch: {
			params: {
				handler (newValue, oldValue) {
					let rst = Object.values(newValue).filter(item => item === '')
					if (!rst.length) {
						this.disabled = false
					} else {
						this.disabled = true
					}
				},
				deep: true
			}
		},
		methods: {
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
			},
			ReGister () {
				this.isPhone(this.params, res => {
					if (res.verifycode === this.code) {
						if (res.password === res.repwd) {
							this.disabled = true
							Register({...this.params, ...this.id}).then(res => {
								if (res.data.code === 'ok') {
									uni.showModal({
										title:"",
										content: res.data.msg,
										showCancel: false,
										success(res) {
											if (res.confirm) {
												uni.redirectTo({
													url: '/pages/login/index'
												})
											}
										}
									})
								} else {
									this.disabled = false
									uni.showModal({
										title: '',
										content: res.data.msg,
										showCancel: false
									})
								}
							})
						} else {
							uni.showModal({
								title: '',
								content: '两次输入密码不一致',
								showCancel:false
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
			}
		}
	}
</script>

<style lang="less">
.userInfo {
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
						& > view {
							&.sex {
								display: flex;
								& > view {
									width: 35upx;
									height: 35upx;
									border:1px solid #e3e3e3;
									border-radius: 50%;
									box-sizing: border-box;
									margin-right: 80upx;
									&.act {
										background:#ec0000;
										border-color:#ec0000;
										position: relative;
										&::after {
											position: absolute;
											content: '\393';
											top: 0;
											left: 0;
											width: 100%;
											height: 100%;
											color:white;
											text-align: center;
											transform: rotate(-135deg);
											font-size: 22upx;
										}
										& > text {
											color:#ec0000;
										}
									}
									& > text {
										color: #808080;
										padding-left: 45upx;
									}
									
								}
							}
						}
					}
					& > input { font-size: 26upx;flex: 1;}
					& > view { 
						flex: 1;
						font-size: 26upx;
						color:#999;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.code {width: 200upx}
						& > button { margin-right: 0;min-width:110px; }
					}
				}
			}
		}		
	}
	.btn {
		margin: 60upx 15px 0;
	}
}

</style>
