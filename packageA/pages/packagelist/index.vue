<template>
    <view class="packageList">
		<view class="list">
			<view class="uni-padding-wrap uni-common-mt" v-for="(item, index) in list" :key="index">
				<view class="uni-card">
					<view class="uni-card-header uni-card-media">
						<image class="uni-card-media-logo" :src="baseURL+'/weixinpl/shopping-temp/images/package.png'"></image>
						<view class="uni-card-media-body">
							<text class="uni-card-media-text-top">{{ item.package_name }}</text>
							<text class="uni-card-media-text-bottom">暂无描述信息</text>
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
	import { packageList } from '@/common/api/packageA'
	import { mapState } from 'vuex'
	import { baseURL } from '@/common/utils/config'
	
    export default {
		name: 'pckageList',
        data() {
            return {
							baseURL: baseURL,
				      list: []
            }
        },
		onLoad (opt) {
			let { level, ptype } = opt
			const user_id = this.userInfo.id
			this.getList({ level, ptype, user_id })
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		methods: {
			getList(opt) {
				packageList(opt).then(res => {
					if (!res.data.code) {
						this.list = res.data.data.data
					}
				})
			}
		}
    }
</script>

<style lang="less">
.packageList {
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
