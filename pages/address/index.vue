<template>
	<view class="myAddress">
		<view class="main">
			<scroll-view scroll-y class="srx">
				<view class="list">
					<view class="item" v-for="(item, index) in list" :key="index" @click="selectAddress(index)">
						<view class="o-t">
							<view>{{ item.name }}</view>
							<view>{{ item.phone }}</view>
						</view>
						<view class="o-a">{{ item.location_p }}-{{ item.location_c }}-{{ item.location_a }} {{ item.address }}</view>
						<view class="o-d">
							<view @click="setDef(item)">
								<view :class="{ act: item.is_default }"></view>
								<view>设为默认</view>
							</view>
							<view>
								<view @click.stop="LinkTo(item)">编辑</view>
								<view @click.stop="delAddr(item.id)">删除</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="add">
			<navigator url="/pages/addAddress/index">新增收货地址</navigator>
		</view>
	</view>
</template>

<script>
	import { address, setDefault, delAddress } from '@/common/api'
	import { mapState } from 'vuex'
	export default {
		name: 'myAddress',
		data() {
			return {
				list: [],
				params: {
					uname: '',
					ticket: '',
					user_id:''
				}
			}
		},
		onShow() {
			this.params.uname = this.userInfo.uname || ''
			this.params.ticket = this.userInfo.ticket || ''
			this.params.user_id = this.userInfo.id || ''
			this.getList()
		},
		methods: {
			LinkTo(item) {
				const data = JSON.stringify(item)
				uni.navigateTo({
					url: '/pages/editAddr/index?item=' + data
				})
			},
			getList() {
				address(this.params).then(res => {
					this.list = res.data.data
				})
			},
			setDef(item) {
				const id = item.id
				setDefault({
					id,
					...this.params
				}).then(res => {
					if (res.data.status) {
						this.list.forEach(rst => {
							rst.is_default = 0
						})
						item.is_default = 1
						uni.showToast({
							icon: 'none',
							title: '设置成功'
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: '设置失败'
						})
					}
				})
			},
			delAddr(id) {
				uni.showModal({
					title: '',
					content: '确认删除该地址？',
					success: (rst) => {
						if (rst.confirm) {
							delAddress({
								id,
								...this.params
							}).then(res => {
								if (res.data.status) {
									this.list = this.list.filter(item => item.id !== id)
								}
							})
						}
					}
				})
			},
			selectAddress(e) {
				console.log(e)
				var index = e,
					address_list = this.list
				console.log(address_list)
				if (address_list[index].is_default == 1) {
					uni.navigateBack({
						delta: 1
					})
					return
				}
				var sendData = {
					uname: this.userInfo.uname,
					ticket: this.userInfo.ticket,
					id: address_list[index].id,
					user_id:this.userInfo.id
				}
				setDefault(sendData).then(res => {
					console.log(res)
					if (res.data.code == 400000) {
						for (var i = 0; i < address_list.length; i++) {
							address_list[i].is_default = 0;
						}
						address_list[index].is_default = 1;
						this.list = address_list
						wx.navigateBack({
							delta: 1
						})
					}
				})

			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
	}
</script>

<style lang="less">
	@import '../../common/css/variables.less'; 
	uni-page-body,
	page {
		height: 100%;
	}
	.myAddress {
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-flow: column;
		flex-direction: column;

		view {
			line-height: 1.4;
		}

		.main {
			flex: 1;
			overflow: hidden;

			.srx {
				height: 100%;

				.list {
					background-color: f6f6f6;

					.item {
						padding: 0 15px;
						color: #333;
						background: white;
						margin-bottom: 30upx;

						&>view {
							font-size: 26upx;
						}

						.o-t,
						.o-a,
						.o-d {
							display: flex;
							justify-content: space-between;
							padding: 15upx 0;
						}

						.o-a {
							position: relative;
							padding-top: 0;

							&::after {
								content: '';
								position: absolute;
								bottom: 0;
								left: -15px;
								width: calc(100% + 30px);
								border-top: 1px solid #f9f9f9;
							}
						}

						.o-d {
							&>view {
								&:first-of-type {
									display: flex;
									justify-content: space-between;
									align-items: center;

									&>view {
										&:first-of-type {
											width: 35upx;
											height: 35upx;
											border: 1px solid #e3e3e3;
											border-radius: 50%;
											box-sizing: border-box;
											margin-right: 15upx;

											&.act {
												background: #ec0000;
												border-color: #ec0000;
												position: relative;

												&::after {
													position: absolute;
													content: '\393';
													top: 0;
													left: 0;
													width: 100%;
													height: 100%;
													color: white;
													text-align: center;
													transform: rotate(-135deg);
													font-size: 22upx;
												}
											}
										}

										&:last-of-type {
											font-size: 22upx;
										}
									}
								}

								&:last-of-type {
									display: flex;
									align-items: center;

									&>view {
										font-size: 22upx;
										background-repeat: no-repeat;
										background-size: contain;
										background-position: left center;
										padding-left: 45upx;
										margin-left: 20upx;

										&:first-of-type {
											background-image: url("@{URL}/weixinpl/shopping-temp/images/edit.png");
										}

										&:last-of-type {
											background-image: url("@{URL}/weixinpl/shopping-temp/images/clear1.png");
										}
									}
								}
							}
						}
					}
				}
			}
		}

		.add {
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: white;
			border-top: 1px solid #f9f9f9;
			box-sizing: border-box;

			&>navigator {
				font-size: 22upx;
				padding: 8upx 0 8upx 55upx;
				background: url("@{URL}/weixinpl/shopping-temp/images/add.png") no-repeat left center/contain;
			}
		}
	}
</style>
