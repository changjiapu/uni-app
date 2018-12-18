<template>
<view class="addAddress">
	<view class="line">
		<view class="title">联系人</view>
		<view>
			<view>
				<text>姓名</text>
				<input type="text" v-model="params.name" placeholder="请填写收货人的姓名"/>
			</view>
			<view>
				<text>手机号码</text>
				<input type="text" v-model="params.phone" placeholder="请填写收货人的手机号码"/>
			</view>
		</view>
	</view>
	<view class="line">
		<view class="title">收货地址</view>
		<view>
			<view>
				<text>所在地区</text>
				<view @click="showMulLinkageThreePicker">
					{{ params.location_p ? params.location_p + '-' + params.location_c + '-' + params.location_a : citys }}
				</view>
			</view>
			<view>
				<text>详细地址</text>
				<input type="text" v-model="params.address" placeholder="请填写收货人的详细地址"/>
			</view>
		</view>
	</view>
	<view class="set">
		<view>
			<view>设置默认地址</view>
			<view @click="params.is_default ? params.is_default = 0 : params.is_default = 1">
				<view :class="{act: params.is_default}"></view>
			</view>
		</view>
	</view>
	<view class="btn">
		<button type="warn" :disabled="disabled" @click="Addaddress">提交</button>
	</view>
	<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
	@onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker'
	import { NewAddress, EditAddr } from '@/common/api'
	import { mapState } from 'vuex'
	export default {
		name: 'comaddr',
		props: {
			item:{
				type: Object
			}
		},
		components: {
			mpvueCityPicker
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		data() {
			return {
				themeColor: '#007AFF',
				cityPickerValueDefault: [0, 0, 1],
				citys: '请选择地址',
				disabled: false,
				params: {
					uname:'',
                    ticket:'',
					name: '',
					phone: '',
					address: '',
					is_default: 0,
					location_p: '',
					location_c: '',
					location_a: ''
// 					lat: '',
// 					lng: '',
// 					address_location: ''
				}
			}
		},
		created() {
			this.params.uname = this.userInfo.uname || ''
			this.params.ticket = this.userInfo.ticket || ''
			this.params.user_id = this.userInfo.id || ''
			if (Object.keys(this.item).length) {
				this.params.name = this.item.name
				this.params.phone = this.item.phone
				this.params.location_p = this.item.location_p
				this.params.location_c = this.item.location_c
				this.params.location_a = this.item.location_a
				this.params.address = this.item.address
				this.params.is_default = this.item.is_default
				this.params.id = this.item.id
			}
		},
		watch: {
			params: {
// 				handler: function (val, oldVal) {
// 					for (let item in val) {
// 						if (!val[item]) {
// 							console.log(val[item])
// 							this.disabled = false
// 							return false
// 						} 
// 					}
// 					this.disabled = true
// 				},
// 				deep: true
			}
			
		},
		methods: {
			onCancel (e) { console.log(e) },
			onConfirm (e) {
				const city = e.label.split('-')
				this.params.location_p = city[0]
				this.params.location_c = city[1]
				this.params.location_a = city[2]
			},
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			Addaddress () {
				const reg = /^[1][3,4,5,7,8][0-9]{9}$/
				if (reg.test(this.params.phone)) {
					let way 
					Object.keys(this.item).length ? way = EditAddr : way = NewAddress
					way(this.params).then(res => {
						if (res.data.status) {
							uni.showModal({
								title: '',
								content: res.data.message,
								showCancel: false,
								success: (rst) => {
									if (rst.confirm) uni.navigateBack()
								}
							})
						}
					})
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
.addAddress {
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
					& > view { flex: 1;padding: 5upx 0; font-size: 26upx; color:#999}
					& > input { font-size: 26upx;flex: 1;}
					& > picker { font-size: 26upx }
				}
			}
		}
	}
	.set {
		& > view {
			display: flex;
			justify-content: space-between;
			margin-top: 30upx;
			background:white;
			padding:20upx 15px;
			& > view {
				font-size: 26upx;
				&:last-of-type {
					& > view {
						width: 35upx;
						height: 35upx;
						border:1px solid #e3e3e3;
						border-radius: 50%;
						box-sizing: border-box;
						margin-right: 15upx;
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
						}
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
