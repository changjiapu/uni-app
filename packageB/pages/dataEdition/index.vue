<template>
	<view class="userInfo">
		<view class="top">
			<view>
				<view :style="{ backgroundImage: 'url('+avatarURL+')' }"></view>
			</view>
			<view>
				<text class="name">{{ userInfo.nickName }}</text>
				<text class="id">ID:{{ userInfo.id }}</text>
			</view>
		</view>
		<view class="list">
			<view class="line">
				<view class="title">个人资料</view>
				<view>
					<view>
						<text>姓名</text>
						<input type="text" v-model="UserInfo.name" placeholder="请填写收货人的姓名"/>
					</view>
					<view>
						<text>性别</text>
						<view>
							<view class="sex">
								<view @click="UserInfo.sex = 1" :class="{act: UserInfo.sex}"><text>男</text></view>
								<view @click="UserInfo.sex = 0" :class="{act: !UserInfo.sex}"><text>女</text></view>
							</view>
						</view>
					</view>
					<view>
						<text>QQ号</text>
						<input type="text" v-model="UserInfo.qq" placeholder="请填写收货人的手机号码"/>
					</view>
					<view>
						<text>微信</text>
						<input type="text" v-model="UserInfo.wechat_id" placeholder="绑定手机号码"/>
					</view>
					<view>
						<text>生日</text>
						<view>
							<picker :value="UserInfo.birthday" class="picker-item" mode="date" :start="startDate" :end="endDate" @change="dateChange">
								<view>{{ UserInfo.birthday }}</view>
							</picker>
						</view>
					</view>
					<view>
						<text>所在地</text>
						<view @click="showMulLinkageThreePicker">
							{{ params.location_p ? params.location_p + '-' + params.location_c + '-' + params.location_a : citys }}
						</view>
					</view>
					<view>
						<text>绑定手机</text>
						<navigator hover-class="none" url="/pages/bindPhone/index">
							<view>{{ UserInfo.phone }}</view>
						</navigator>
					</view>
					<view>
						<text>密码</text>
						<input type="text" v-model="UserInfo.password" :disabled="enable">
					</view>
				</view>
			</view>
		</view>
		<view class="btn">
			<button type="warn" :disabled="disabled" @click="EditUser">提交</button>
		</view>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		@onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import { getUserInfo, EditUserInfo } from '@/common/api/packageB'
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker'
	import { mapState } from 'vuex'
	import { baseURL } from '@/common/utils/config'
	
	export default {
		name: 'dataEdition',
		components: { mpvueCityPicker },
		data() {
			return {
				disabled: false,
				citys: '请选择地址',
				themeColor: '#007AFF',
				cityPickerValueDefault: [0, 0, 1],
				enable: true,
				UserInfo: {
					name: '',
					sex: '',
					qq: '',
					wechat_id: '',
					birthday: '',
					phone: '',
					password: ''
				},
				data: {
					uname: '',
					ticket: ''
				},
				params: {
					location_p: '',
					location_c: '',
					location_a: ''
				}
			}
		},
		onLoad(rst) {
			this.data.user_id = this.userInfo.id
			this.getInfo(rst.phone)
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			...mapState([
				'userInfo'
			]),
			avatarURL () {
				const IMG = baseURL+'/weixinpl/shopping-temp/images/default.png'
				if(this.userInfo.avatarUrl) {
					return this.userInfo.avatarUrl === null ? IMG : this.userInfo.avatarUrl
				} else {
					return IMG
				}
			}
		},
		methods: {
			getInfo(phone) {
				const currentDate = this.getDate({
					format: true
				});
				this.data.uname = this.userInfo.uname || ''
				this.data.ticket = this.userInfo.ticket || ''
				getUserInfo(this.data).then(res => {
					if (res.data.code !== 4001) {
						if (phone) res.data.data.phone = phone
						if (res.data.data.birthday === null) {
							res.data.data.birthday = currentDate
						}
						this.UserInfo = res.data.data
					    if (this.UserInfo.password === '未设置密码' || !this.UserInfo.password) {
							this.UserInfo.password = ''
							this.enable = false
						}
						if (res.data.data.address !== null) {
							const city = res.data.data.address.split('-')
							this.params.location_p = city[0]
							this.params.location_c = city[1]
							this.params.location_a = city[2]	
						}
					}
				})
			},
			onConfirm (e) {
				const city = e.label.split('-')
				this.UserInfo.address = e.label
				this.params.location_p = city[0]
				this.params.location_c = city[1]
				this.params.location_a = city[2]				
			},
			onCancel (e) {},
			showMulLinkageThreePicker () {
				this.$refs.mpvueCityPicker.show()
			},
			dateChange (e) {
				console.log(e)
				this.UserInfo.birthday = e.detail.value
			},
			EditUser () {
				const params = Object.assign({}, this.data, this.UserInfo)
				EditUserInfo(params).then(res => {
					uni.showToast({
						icon: 'none',
						title: res.data.message
					})
				})
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;

				return `${year}-${month}-${day}`;
			}			
		}
	}
</script>

<style lang="less">
.userInfo {
	.top {
		background:#0099ff;
		color:white;
		display: flex;
		padding: 35upx 15px;
		& > view {
			&:first-of-type {
				width: 120upx;
				margin-right: 20upx;
				& > view {
					background-repeat: no-repeat;
					background-size: cover;
					background-position: top center;
					padding-top: 100%;
					border-radius: 50%;
				}
			}
			&:last-of-type {
				display: flex;
				flex-flow: column;
				flex-direction: column;
				justify-content: space-between;
				padding: 10upx 0;
				& > text {
					&.name { font-size: 26upx; }
					&.id {
						background:white;
						border-radius: 15upx;
						color:#0099ff;
						font-size: 22upx;
						padding: 5upx 20upx;
					}
				}
			}
		}
	}
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
						& > text { font-size: 26upx;width: 120upx;text-align: justify;text-align-last:justify;padding-right: 30upx; }
						& > view, & > navigator { flex: 1;padding: 5upx 0; font-size: 26upx; color:#999;
						    & > .picker-item {
								font-size: 26upx;
								text-align: left;
								line-height:  1.5;
							}
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
