<template>
	<view class="bigbag" v-if="list.length">
		<view class="list">
			<view class="uni-padding-wrap uni-common-mt" v-for="(item, index) in list" :key="index">
				<view class="uni-card">
					<view class="uni-card-header uni-card-media">
						<image class="uni-card-media-logo" :src="baseURL+'/weixinpl/shopping-temp/images/package.png'"></image>
						<view class="uni-card-media-body">
							<text class="uni-card-media-text-top">{{ item.package_name }}</text>
						<!-- 	<text class="uni-card-media-text-bottom">暂无描述信息</text> -->
						</view>
					</view>
					<navigator :url="'/packageA/pages/packageDetails/index?id='+item.id" hover-class="none" class="uni-card-content image-view">
						<image class="image" :src="item.default_imgurl"></image>
					</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	'use strict'
import { PackageList } from '@/common/api/packageA'
import { mapState } from 'vuex'
import { baseURL } from '@/common/utils/config'
export default { 
	name: 'bigBag',
	data () {
		return {
			baseURL: baseURL,
			list: [],
			params: {
				ptype: '',
				level: '',
				user_id:''
			}
		}
	},
	onLoad(option) {
		this.params.ptype = option.ptype || ''
		this.params.level = option.level ||''
		this.params.user_id = this.userInfo.id
		if (this.params.user_id) {
			PackageList(this.params).then(res => {
				if (!res.data.code) this.list = res.data.data.data
			})	
		} else {
			uni.showModal({
				title: '',
				content: '你还没登录，无法获取信息',
				confirmText: '去登录',
				success: res => {
					if (res.confirm) {
						uni.reLaunch({
							url: '/pages/login/index'
						})
					} else {
						uni.navigateBack()
					}
				}
			})
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
.bigbag {
	display: flex;
	flex-wrap: wrap;
	.list {
		.uni-common-mt {
			margin: 15upx 0;
			.uni-card {
				margin: 0;
				.image-view {
				   overflow: hidden;
				   height: auto;
					.image {
						width: 100%;
						display: block;
					}	   
				}
			}
		}
	}	
}
</style>
