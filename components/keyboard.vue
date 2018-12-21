<template>
	<view class="model">
		<view class="statubar" @tap="$emit('on-close')"></view>
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
</template>

<script>
	import { paySet } from '@/common/api'
	import { mapState } from 'vuex'
	export default {
		name: 'keyboard',
		data() {
			return {
			password: '',
			originalPwd: '',
			 key: {
			 	code: [[1,2,3],[4,5,6],[7,8,9],['x',0,'.',]],
			 	control: ['', '取消']
			 }	
			}
		},
		created() {
			this.getPwd()
		},
		methods: {
			InputPwd(key) {
				if (this.password.length !== 6) this.password += key
			},
			control (event) {
				switch (event) {
					case '':
					this.password = this.password.substr(0, this.password.length - 1)
					break
					case '取消':
					this.$emit('on-close')
					break
				}
			},
			getPwd() {
				const user_id = this.userInfo.id
				paySet({ user_id }).then(res => {
					console.log(res)
					if (res.data.code === 1) {
						this.originalPwd = res.data.mge
					} else if (res.data.code === 0) {
						uni.showModal({
							title: '',
							content: '你还没有设置支付密码',
							confirmText: '去设置',
							success: res => {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/setPassword/setPassword'
									})
								}
							}
						})
					}
				})
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
						this.$emit('on-confrim', this.password)
					}
				}
			},
			keyShow: function(val, oldval) {
				if (!val) this.password = ''
			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		}
	}
</script>

<style lang="less">
@import '../common/css/variables.less';	
	.model {
		height: 100%;
		position: fixed;
		width: 100%;
		top:0;
		left: 0;
		display: flex;
		align-items: flex-end;
		z-index: 4;
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
</style>
