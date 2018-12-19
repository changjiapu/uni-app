<template>
	<view class="bind">
		<view class="list">
			<form @submit="ReGister" @reset="formReset">
				<view class="line">
					<view>
						<view>
							<text>真实姓名</text>
							<input type="text" name="name" v-model="params.name" placeholder="请填写您的真实姓名"/>
						</view>
						<view>
							<text>手机号码</text>
							<input type="text" name="phone" v-model="params.phone" placeholder="请填写您的手机号码"/>
						</view>
						<view>
							<text>开户行</text>
							<input type="text" name="account_bankname" placeholder="请填写您的开户行" v-model="params.account_bankname"/>
						</view>
						<view>
							<text>所属支行</text>
							<input type="text" name="account_address" placeholder="开户行所属支行" v-model="params.account_address"/>
						</view>
						<view>
							<text>银行卡号</text>
							<input type="text" name="account" v-model="params.account" placeholder="请输入用户名"/>
						</view>
					</view>
				</view>
				<view class="btn">
					<button type="warn" :loading="loading" :disabled="loading" formType="submit">提交</button>
				</view>
			</form>
		</view>
		<key-board v-if="keyShow" @on-close="keyShow = false" @on-confrim="addAccount"></key-board>
	</view>
</template>

<script>
	import graceChecker from '@/common/utils/graceChecker'
	import { SavePayAccount } from '@/common/api'
	import { mapState } from 'vuex'
	import KeyBoard from '@/components/keyboard'
	
	export default {
		name:'bindCard',
		components: { KeyBoard },
		data() {
			return {
				loading: false,
				keyShow: false,
				params: {
					name: '',
					phone: '',
					account_bankname: '',
					account_address: '',
					account: '',
					pw: '',
					type: 4,
					user_id: '',
					identity: ''
				}
			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		methods: {
			ReGister (e) {
				const rule = [
					{ name: "name", checkType : "notnull", errorMsg: "请输入真实姓名" },
					{ name: "phone", checkType : "phoneno", errorMsg: "请输入正确的手机号" },
					{ name: "account_bankname", checkType: "notnull", errorMsg: "请填写开户行" },
					{ name: "account_address", checkType: "notnull", errorMsg: "请填写开户行支行" },
					{ name: "account", checkType: "string", checkRule: "16,19" , errorMsg: "请填写正确的银行卡号" }
				]
				const formData = e.detail.value
				console.log(formData)
				const checkRes = graceChecker.check(formData, rule)
				 if (checkRes) {
					 this.keyShow = true
				 } else {
					 uni.showToast({ title: graceChecker.error, icon: "none" });
				 }
			},
			addAccount (password) {
				this.params.pw = password
				this.params.user_id = this.userInfo.id
				SavePayAccount(this.params).then(res => {
					if (!res.data.code) {
						uni.navigateBack()
					}
				})
			}
		}
	}
</script>

<style lang="less">
.bind {
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
