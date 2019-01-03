<template>
	<view class="userCenter">
   <view class='head style'>
        <view class='personal-head-img'>
            <image :src="userInfo.avatarUrl || baseURL+'/weixinpl/shopping-temp/images/default.png'" class="img"></image>
        </view>
        <view class='personal-name'>
            <view class='name'>{{userInfo.nickName || ''}}(ID:{{userInfo.id || '未登录'}})</view>
        </view>
        <view class='personal_card'>
            <view class='name' v-for="(item, index) in userInfo.rank" :key="index">
                <image :src="item.images" class="img"></image>
                <text class="text">{{item.name}}</text>
            </view>
        </view>
    </view>
    <block v-if="data.style.active === 'style-1'">
        <view v-for="(item, index) in list" :key="index" class='style-1' @click="GoTo(item)">
					<view>
						<image :src='item.url' class="img"></image>
						<view :style="{color: item.color}">{{item.name}}</view>
					</view>
            <image class='right' :src="baseURL+'/weixinpl/shopping-temp/images/arrows-right.png'"></image>
        </view>
    </block>
    <block v-if="data.style.active === 'style-2'">
       <view class='style-2_c'>
            <view v-for="(item, index) in list" :key="index" class='style-2' @click="GoTo(item)">
                <image :src='item.url' class="img"></image>
                <view class='style-2-n' :style='{color:item.color}'>{{item.name}}</view>
            </view>
        </view>
    </block>
<!-- #ifndef MP-WEIXIN -->
		<view class="logout">
			<button type="warn" v-if="userInfo.id" @click="$store.dispatch('logout')">
				<text>退出登录</text>
			</button>
			<button type="primary" v-else @click="login">
				<text>登录</text>
			</button>
		</view>
<!-- #endif -->
	</view>
	</view>
</template>

<script>
	import {getUserIdentity } from '@/common/api'
	import { mapState } from 'vuex'
	import { baseURL } from '@/common/utils/config'
	
	export default {
		name: 'user_center',
		props: {
			data: {
				type: Object,
				required: true
			},
		},
		data(){
			return{
				baseURL: baseURL,
				card:{}
			}
		},
		onLoad() {
		  getUserIdentity().then(res=>{
			  this.card=res.data.data
		   })
		},
		methods: {
			GoTo(item) {
				this.$gotoLogin().then(res => {
					if (res) {
						switch (item.id) {
							case 15:
							if ([5,1].includes(this.dianpuleibie)) {
								uni.navigateTo({
								url: '/pages/myOrder/index'
								})
							} else if (this.dianpuleibie === 2) {
								uni.navigateTo({
								url: '/packageB/pages/order2'
								})
							} else if (this.dianpuleibie === 4) {
								uni.navigateTo({
								url: '/packageB/pages/order4',
								})
							}
							break;
							case 16:
							uni.navigateTo({
								url: '/pages/myfoot/index'
							})
							break;
							case 17:
							uni.navigateTo({
								url: "/pages/myCollect/index"
							})
							break;
							case 18:
							uni.navigateTo({
								url: '/pages/address/index'
							})
							break;
							case 19:
							uni.navigateTo({
								url: '/pages/myAssets/index'
							})
							break;
							case 20:
							uni.navigateTo({
								url: '/packageB/pages/dataEdition/index'
							})
							break;
							case 21:
							uni.navigateTo({
							//	url: '/pages/login/index'
							})
							break;
							case 22:
							uni.navigateTo({
								url: '/packageB/pages/share-app'
							})
							break;
							case 105:
							uni.navigateTo({
								url: '/pages/my-give'
							})
							break;
							case 106:
							uni.navigateTo({
								url: '/packageA/pages/myPrivilege/index'
							})
							break;
							case 115:
							uni.navigateTo({
								url: '/pages/my-collage'
							})
							break;
							case 114:
							uni.navigateTo({
								url: '/pages/Distribution/index'
							})
							break;
						}
					}
				})
			},
			login () {
				uni.navigateTo({
					url: '/pages/login/index'
				})
			}
		},
		computed: {
			list() {
				return this.data.limit_list.filter(item => item.checked)
			},
			...mapState([
				'dianpuleibie',
				'userInfo'
			])
		}
	}
</script>
<style lang="less">
.userCenter {
	.head {
		position: relative;
		&.style {
			background-color:#0099ff;
			.personal-head-img {
				padding: 20upx 0 0 0;
				width: 100%;
				text-align: center;
				.img {
					display: inline-block;
					width: 150upx;
					height: 150upx;
					border-radius: 50%;
				}
			}
			.personal-name {
				height: 60upx;
				text-align: center;
				color: #fff;
				font-weight: 700;
				.name {
					line-height: 65upx;
					font-size: 28upx;
					margin-bottom: 14upx;
				}
			}
			.personal_card {
				width: 100%;
				color: #fff;
				padding-bottom: 28upx;
				display: flex;
				justify-content: center;
				.name {
					display: flex;
					align-items: center;
					justify-content: center;
					margin-left:12upx;
				}
				.img {
					width: 30upx;
					height: 30upx;
				}
				.text {
					margin-left: 10upx;
					font-size: 26upx;
				}
			}
		}
	}
	.style-1 {
		display: flex;
		align-items: center;
		font-size: 28upx;
		color: #888;
		height: 90upx;
		padding:0 15px;
		border-bottom: 1px solid #e4e7ed;
		justify-content: space-between;
		& > view {
			display: flex;
			align-items: center;
			.img {
				width: 60upx;
				height: 60upx;
				margin-right: 5px;
				border-radius: 100upx;
			}
		}
		.right {
			width: 30upx;
			height: 30upx;
		}
	}
	.style-2 {
	    display: inline-block;
	    width: 200upx;
	    font-size: 26upx;
	    color: #888;
	    margin-left: 40upx;
	    margin-top: 20upx;
	    text-align: center;
			.style-2_c {
				background-color: #fff;
				.style-2-n {
					margin-top: 20upx;
				}
			}
			.img {
				margin: 0 auto;
				width: 60upx;
				height: 60upx;
				border-radius: 100upx;
			}
	}
	.logout {
		padding: 8px 15px 110upx 15px;
		font-size: 12px;
		margin:20upx 15px;
	}
}
</style>