<template>
	<view>
		<view class='Promoter'>
			<view class='img'>
				<image :src='detail.member.weixin_headimgurl'> </image>
			</view>
			<view class='msg'>
				<view style='font-size:40upx'>{{detail.member.weixin_name}}</view>
				<view>推荐人：{{detail.member.parent_name}}</view>
				<view class='classify'>
					<text v-if="detail.member.ident['1']">{{detail.member.ident['1']}}</text>
					<text v-if="detail.member.ident['2']">{{detail.member.ident['2']}}</text>
					<text v-if="detail.member.ident['3']">{{detail.member.ident['3']}}</text>
				</view>
			</view>
		</view>
		<view class='money'>
			<view class='left'>
				<image :src="baseURL+'/weixinpl/shopping-temp/images/money.png'"></image>
				<text>消费总额</text>
			</view>
			<view class="right">￥{{detail.member.total_money}}</view>
		</view>
		<view class='info'>基本信息</view>
		<view class='list'>
			<view>姓名:</view>
			<view style='color:#999'>{{!detail.member.name?'未填写':detail.member.name}}</view>
		</view>
		<view class='list'>
			<view>性别:</view>
			<view v-if="!detail.member.sex" style='color:#999'>未填写</view>
			<view v-else style='color:#999'>{{detail.member.sex==1?'男':'女'}}</view>
		</view>
		<view class='list' v-if="detail.row_pidt.is_weixin==1">
			<view>微信号:</view>
			<view style='color:#999'>{{!detail.member.wechat_id?'未填写':detail.member.wechat_id}}</view>
		</view>
		<view class='list' v-if="detail.row_pidt.is_qq==1">
			<view>QQ:</view>
			<view style='color:#999'>{{!detail.member.qq?'未填写':detail.member.qq}}</view>
		</view>
		<view class='list'>
			<view>生日:</view>
			<view style='color:#999'>{{!detail.member.birthday?'未填写':detail.member.birthday}}</view>
		</view>
		<view class='list'>
			<view>地区:</view>
			<view style='color:#999' space="nbsp">{{!detail.member.province?'未填写':detail.member.province}}
				{{!detail.member.city?'':detail.member.city}}</view>
		</view>
		<view class='list' v-if="detail.row_pidt.is_weixincode==1">
			<view>二维码:</view>
			<image style="width:60px;height:60px;" :src='detail.member.wechat_code'></image>
		</view>
		<view class='list'>
			<view>职业:</view>
			<view style='color:#999'>{{!detail.member.occupation?'未填写':detail.member.occupation}}</view>
		</view>
	</view>
</template>

<script>
	import { TeamPerson } from '@/common/api/packageB.js'
	import { baseURL } from '@/common/utils/config'
	export default {
		data() {
			return {
				baseURL: baseURL,
				loaded: false,
				detail: {}
			};
		},
		onLoad(options) {
			var persion_id = options.id
			TeamPerson({
				persion_id
			}).then(res => {
				if (!res.data.code) {
					this.detail = res.data.data
				}
			})
		}
	}
</script>

<style scoped>
	.Promoter {
		display: flex;
		align-items: center;
		background-color: #333;
		color: #fff;
		padding: 20rpx;
	}

	.Promoter .img {
		display: flex;
	}

	.Promoter .img image {
		width: 170rpx;
		height: 170rpx;
		border-radius: 100rpx;
	}

	.Promoter .msg {
		margin-left: 20rpx;
	}

	.Promoter .msg>view {
		margin-top: 10rpx;
	}

	.Promoter .msg .classify text:nth-child(1) {
		background-color: #90ee90;
		padding: 5rpx;
		border-radius: 5rpx;
	}

	.Promoter .msg .classify text:nth-child(2) {
		margin-left: 10rpx;
		background-color: orange;
		padding: 5rpx;
		border-radius: 5rpx;
	}

	.Promoter .msg .classify text:nth-child(3) {
		margin-left: 10rpx;
		background-color: red;
		padding: 5rpx;
		border-radius: 5rpx;
	}

	.money {
		background-color: #fff;
		border-bottom: 1px solid #ccc;
		padding-left: 20rpx;
		padding-right: 20rpx;
		height: 150rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.money .left {
		display: flex;
	}

	.money .right {
		color: #dc143c;
	}

	.money .left image {
		height: 40rpx;
		width: 40rpx;
	}

	.info {
		background-color: #ddd;
		border-bottom: 1px solid #ccc;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
	}

	.list {
		background-color: #fff;
		border-bottom: 1px solid #ccc;
		padding-left: 20rpx;
		padding-right: 20rpx;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
