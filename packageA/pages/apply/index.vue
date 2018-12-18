<template>
	<view class="apply">
		<view class="list">
			<view class="line">
				<view class="title">个人资料</view>
				<view>
					<view>
						<text>联系人</text>
						<input type="text" v-model="apply.name" placeholder="请输入联系人"/>
					</view>
					<view>
						<text>联系电话</text>
						<input type="text" v-model="apply.phone" placeholder="请输入联系电话"/>
					</view>
					<view>
						<text>微信号</text>
						<input type="text" v-model="apply.weixin" placeholder="请输入微信号"/>
					</view>
				</view>
			</view>
			<view class="line">
				<view class="title">店铺资料</view>
				<view>
					<view>
						<text>店铺名称</text>
						<input type="text" v-model="apply.shopName" placeholder="请输入店铺名称"/>
					</view>
					<view>
						<text>所在地区</text>
						<view @click="showMulLinkageThreePicker">
							{{ params.location_p ? params.location_p + '-' + params.location_c + '-' + params.location_a : citys }}
						</view>
					</view>					
					<view>
						<text>详细地址</text>
						<input type="text" v-model="apply.address" placeholder="请输入详细地址"/>
					</view>
					<view>
						<text>所售类目</text>
						<view @click="showSinglePicker">{{ apply.category }}</view>
					</view>
				</view>
				<view class="arge">
					<checkbox-group class="checkbox" @change="checkboxChange">
						<label v-for="item in items" :key="item.value">
							<checkbox :value="item.name" :checked="apply.agree" />
						</label>
					</checkbox-group>
					<view class="text">我已经阅读并同意<text @click="close">《入住协议》</text></view>
				</view>
			</view>
			<view class="btn">
				<button type="warn" :disabled="disabled" @click="BindPhone">提交</button>
			</view>						
		</view>
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		@onConfirm="onPickerComfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		@onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		<alert-rich :data="agre" v-if="showAgre" @on-close="close"></alert-rich>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker'
	import mpvuePicker from '@/components/mpvue-citypicker/mpvuePicker.vue';

	import AlertRich from '@/components/richtext'

	export default {
		name: 'apply',
		components: { mpvueCityPicker, AlertRich, mpvuePicker },
		data() {
			return {
				citys: '请选择地区',
				disabled: false,
				themeColor: '#007AFF',
				agre: '',
				showAgre: false,
				cityPickerValueDefault: [0, 0, 1],
				mode: '',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray: [
					{label: '男女服装', value: 1 },
					{label: '数码家电', value: 2 },
					{label: '食品饮料', value: 3 },
					{label: '家居百货', value: 4 },
					{label: '箱包配饰', value: 5 },
					{label: '医药保健', value: 6 }],
				params: {
					location_p: '',
					location_a: '',
					location_c: ''
				},
                items: [{name: 'agre'}],
				apply: {
					name: '',
					phone: '',
					weixin: '',
					shopName: '',
					area: '',
					address: '',
					category: '请选择类目',
					agree: false
				}
			}
		},
		methods: {
			close () {
				this.showAgre = !this.showAgre
			},
			onCancel (e) {},
			showMulLinkageThreePicker () {
				this.$refs.mpvueCityPicker.show()
			},
			// 单列
			showSinglePicker() {
				this.mode = 'selector'
				this.deepLength = 1
				this.pickerValueDefault = [0]
				this.$refs.mpvuePicker.show()
			},
			onConfirm (e) {
				const city = e.label.split('-')
				this.params.location_p = city[0]
				this.params.location_c = city[1]
				this.params.location_a = city[2]				
			},
            onPickerComfirm (e) {
				console.log(e)
				this.apply.category = e.label
			},
			checkboxChange (e) {
				
			}					
		}
	}
</script>

<style lang="less">
.apply {
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
			& > .arge {
				margin: 15px;
				display: flex;
				align-items: center;
				.checkbox {
					width: auto;
				}
				.text {
					font-size: 26upx;
					text { color:#0500e8 }
				}
			}
		}
		.btn {
			margin: 60upx 15px 0;
		}				
	}
}
</style>
