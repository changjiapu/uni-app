<template>
<view class="distributor">
	<view class="head">
		<view>
			<view class="avatar" :style="{backgroundImage: 'url('+ avatarURL +')'}"></view>
			<view class="name">{{ userInfo.nickName }}</view>
			<view class="level">
				<view>ID: {{ userInfo.id }}</view>
			</view>
		</view>
	</view>
	<view class="list">
		<view class="agreement">
			<view @click="close">查看用户协议</view>
		</view>
		<view class="main">
			<scroll-view scroll-y class="srx">
				<view class="item" v-for="(item, index) in list" :key="index">
					<view>{{ item.next_level_name }}</view>
					<view class="progress-box" v-for="(m ,idx) in item.condition" :key="idx">
						<progress show-info color="#10AEFF" active stroke-width="3" :percent="m.percentage"/>
						<view class="ms"><view>{{ m.show_type }}</view><view>{{ m.show_num }}/{{ m.need_num }}{{m.company}}</view></view>
					</view>
					<view class="mini-btn">
						<view hover-class="none" class="btn" @click="update(item)">升级</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
	<alert-rich :data="agre" v-if="showAgre" @on-close="close"></alert-rich>
</view>
</template>

<script>
	import { StoreRewar, sHugrade } from '@/common/api/packageA'
	import AlertRich from '@/components/richtext'
	import { mapState } from 'vuex'
	import { baseURL } from '@/common/utils/config'

	export default {
		name: 'myShop',
		components: { AlertRich },
		data() {
			return {
				baseURL: baseURL,
				list: [],
				agre: '',
				showAgre: false,
				params: {},
				info: {}
			}
		},
		onLoad () {
			this.params.user_id = this.userInfo.id
			this.getInfo()
		},
		methods: {
			getInfo() {
				uni.showLoading()
				StoreRewar(this.params).then(res => {
					uni.hideLoading()
					if (!res.data.code) {
						this.list = res.data.data.data
						this.agre = res.data.data.rule
					}
				})
			},
			close () {
				this.showAgre = !this.showAgre
			},
			update (item) {
				const params = {
					come_type: 1,
					level: item.upgrade_level
				}
				uni.showLoading()
				sHugrade({ ...this.params, ...params }).then(res => {
					uni.hideLoading()
					if (res.data.status === 401) {
						uni.showModal({
							title: '',
							content: res.data.errormsg,
							showCancel: false
						})
					} else {
						uni.showModal({
							title: '',
							content: '升级成功',
							showCancel: false
						})
					}
				})
			}
		},
		computed: {
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
		}
	}
</script>

<style lang="less">
@import '../../../common/css/variables.less';	
uni-page-body, page { height: 100%;}	
.distributor {
	display: flex;
	flex-flow: column;
	flex-direction: column;
	height: 100%;
	.head {
		background-color:#0099ff;
		color:white;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40upx 0;
		& > view {
			text-align: center;
			.avatar {
				background-repeat: no-repeat;
				background-size: cover;
				background-position: top center;
				width: 150upx;
				height: 150upx;
				border-radius: 50%;
				margin: 0 auto;
			}
			.name {
				margin: 15upx 0;
				font-size: 30upx
			}
			.level {
				font-size: 26upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				& > view {
					background-repeat: no-repeat;
					background-size: contain;
					background-position: left center;
					margin-right: 25upx;
					background:white;
					border-radius: 15upx;
					color:#0099ff;
					font-size: 22upx;
					padding: 5upx 20upx;
					&:last-of-type {
						margin-right: 0;
					}
				}
			}
		}
	}
	.list {
		flex: 1;
		display: flex;
		flex-direction: column;
		flex-flow: column;
		background-color:#efefef;
		.agreement {
			height: 80upx;
			line-height: 80upx;
			padding: 0 15px;
			font-size: 26upx;
			background-color:#f6f6f6;
			display: flex;
			justify-content: center;
			align-items: center;
			& > view {
				background-repeat: no-repeat;
				background-position: left center;
				background-size: 35upx 35upx;
				background-image: url("@{URL}/weixinpl/shopping-temp/images/agre.png");
				padding-left: 40upx;
				color:#0099FF
			}
		}
		.main {
			flex: 1;
			overflow: hidden;
			.srx {
				height: 100%;
				box-sizing: border-box;
				padding: 20upx 0;
				.item {
					background-color:white;
					border-radius: 10px;
					margin: 0 20upx 15upx;
					padding: 15upx;
					display: flex;
					position: relative;
					flex-flow: column;
					flex-direction: column;
					position: relative;
					.progress-box {
						display: flex;
						height: 50upx;
						flex-direction: column;
						flex-flow: column;
						margin-bottom: 40upx;
						.ms {
							margin-top: 20upx;
						}
					}
					.ms {
						font-size: 22upx;
						display: flex;
						justify-content: space-between;
						align-items: center;
					}
					.mini-btn {
						display: flex;
						justify-content: center;
						align-items: center;
						.btn {
							font-size: 22upx;
							color: #fff;
							background-color: #e64340;
							display: block;
							border-radius: 10upx;
							padding:  15upx 20upx;
							text-align: center;
							min-width: 100upx;
						}
					}
				}
			}
		}
		.Info {
			image {
				width: 250upx;
				height: 250upx;
				margin: 20upx auto;
				display: block;
			}
			.text {
				text-align: center;
				display: flex;
				flex-direction: column;
				flex-flow: column;
				& > text {
					font-size: 30upx;
					padding: 10upx 0;
					color:#FF5722
				}
			}
		}
	}
}
</style>
