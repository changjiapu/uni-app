<template>
	<view class="bindPhone">
		<view class="list">
			<view class="line">
				<view class="title">绑定手机</view>
				<view>
					<view>
						<text>手机</text>
						<input type="text" v-model="params.phone" placeholder="请输入手机号码"/>
					</view>
					<view>
						<text>验证码</text>
						<view>
							<input type="text" v-model="params.code" placeholder="获取验证码"/>
							<button @click="GetCodes" class="getcode" :disabled="getCode" type="primary" hover-class="none" size="mini">
								{{ time !== 0 ? time + 's' : '获取验证码' }}
							</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn">
			<button type="warn" @click="BindPhone">确认绑定</button>
		</view>
	</view>
</template>

<script>
	import { sendPhoneMsg } from '@/common/api'
	export default {
		name: 'bindphone',
		data() {
			return {
				disabled: true,
				getCode: false,
				time: 0,
				code: '',
				params: {
					phone: '',
					code: ''
				}
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
			BindPhone () {
				this.isPhone({}, () => {
					if (this.code && this.code === this.params.code) {
						uni.redirectTo({
							url: '/packageB/pages/dataEdition/index?phone='+this.params.phone
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: '请输入正确的验证码'
						})
					}
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
.bindPhone {
	.list {
		
		.line {
			.title {
				height: 80upx;
				line-height: 80upx;
				font-size:26upx;
				padding: 0 15px;
				& + view {
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
						& > text { font-size: 26upx;width: 120upx;text-align: justify;text-align-last:justify;padding-right: 30upx; 			white-space: normal;}
						& > view { 
							flex: 1;
							font-size: 26upx;
							color:#999;
							display: flex;
							justify-content: space-between;
							align-items: center;
							& > button { margin-right: 0;}
						}
						& > input { font-size: 26upx;flex: 1;}
						& > picker { font-size: 26upx }
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
