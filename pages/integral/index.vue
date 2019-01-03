<template>
	<view class="integral">
		<view class="head">
			<image :src="baseURL+'/weixinpl/images/jifen.jpg'" mode="widthFix"></image>
		</view>
		<button class="receive" @click='singOnclik'>{{todayStatus||'点击签到'}}</button>
		<view class='middle'>
			<view @click='tabData(1)'>
				<text>总积分</text>
				<text>{{result.total_score}}</text>
			</view>
			<view @click='tabData(2)'>
				<text>剩余积分</text>
				<text>{{result.remain_score}}</text>
			</view>
			<view @click='tabData(3)'>
				<text>签到积分</text>
				<text>{{result.sign_score}}</text>
			</view>
			<view @click='tabData(4)'>
				<text>消费积分</text>
				<text>{{result.consume_score}}</text>
			</view>
		</view>
		<view class='footer' v-if="listtype==1 || listtype==2">
			<view class='nav'>
				<text>日期</text>
				<text>充值前</text>
				<text>积分</text>
				<text>充值后</text>
				<text>备注</text>
			</view>
			<view class='nav2' v-for="(item,index) in score" :key='index'>
				<text>{{item.createtime}}</text>
				<text>{{item.before_score}}</text>
				<text>{{item.score}}</text>
				<text>{{item.after_score}}</text>
				<text>{{item.remark}}</text>
			</view>
		</view>
		<view class='footer' v-if="listtype==3">
			<view class='nav_head'>
				<text>日期</text>
				<text>签到情况</text>
				<text>积分</text>
			</view>
			<view class='nav2_con' v-for="(item,index) in score" :key='index'>
				<text decode>{{item.dvar}}&nbsp;{{item.weekstr}}</text>
				<text v-if="item.status=='签到'" style="color:#02ae02;">{{item.status}}</text>
				<text v-else>{{item.status}}</text>
				<text v-if="item.score" style="color:#02ae02;">{{item.score}}</text>
				<text v-else>{{item.score}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		ScoreRecord,
		scoreSign,
		singOnclik
	} from "@/common/api"
	import { baseURL } from '@/common/utils/config'
	export default {
		data() {
			return {
				baseURL: baseURL,
				card_id: '',
				result: '',
				score: '',
				listtype: '1',
				todayStatus: ''
			};
		},
		onLoad(option) {
			this.card_id = option.card_id
			this.score_record()
		},
		methods: {
			/*签到积分*/
			score_sign() {
				scoreSign({
					user_id: this.userInfo.id,
					card_id: this.card_id
				}).then(res => {
					if (!res.data.code) {
						this.score = res.data.data.dayData,
							this.todayStatus = res.data.data.todayStatus
					}
				})
			},
			/* 总积分和剩余积分*/
			score_record() {
				ScoreRecord({
					user_id: this.userInfo.id,
					card_id: this.card_id
				}).then(res => {
					if (!res.data.code) {
						this.score = res.data.data.score
						this.result = res.data.data.result
					} else {
						uni.showModal({
							title: '提示',
							content: res.data.message,
							showCancel: false
						})
					}
				})
			},
			//切换
			tabData: function(e) {
				this.listtype = e
				this.score = []
				if (e == 1 || e == 2) {
					this.score_record()
				}
				if (e == 3) {
					this.score_sign()
				}
				if (e == 4) {
					uni.navigateTo({
						url: '/pages/my-member-money?card_id=' + this.card_id,
					})
				}

			},
			/*
			 *领取今日积分 
			 */
			singOnclik: function() {
				singOnclik({
					user_id: this.userInfo.id,
					card_id: this.card_id
				}).then(res => {
					if (!res.data.code) {
						uni.showModal({
							title: '提示',
							content: res.data.data,
							showCancel: false
						})
					} else {
						uni.showModal({
							title: '提示',
							content: res.data.message,
							showCancel: false
						})
					}
				})

			},
		},
		computed: {
			...mapState([
				'dianpuleibie',
				'userInfo'
			])
		}
	}
</script>

<style lang="less">
	.integral {
		.head {
			image {
				width: 100%;
			}
		}

		.middle {
			margin-top: 10px;
			background-color: #fff;
			display: flex;
			justify-content: space-around;
			border: 1px solid #ccc;
			border-radius: 10rpx;
			padding: 10px 20px;
		}

		.middle view {
			text-align: center;
			display: flex;
			flex-direction: column;
			border-right: 1px dashed #CCC;
			padding-right: 10PX
		}

		.middle view:last-child {
			border-right: none;
		}

		.footer {
			padding: 10px;
			margin-top: 20rpx;
			background-color: #fff;
			border: 1px solid #CCC;
			border-radius: 10rpx;
		}

		.footer .nav {
			padding: 20rpx 0;
			background-color: #ccc;
			display: flex;
			align-items: center;
		}

		.footer .nav text {
			display: inline-block;
			align-items: center;
			text-align: center;
		}

		.footer .nav text:nth-child(1) {
			width: 15%
		}

		.footer .nav text:nth-child(2) {
			width: 14%
		}

		.footer .nav text:nth-child(3) {
			width: 16%
		}

		.footer .nav text:nth-child(4) {
			width: 14%
		}

		.footer .nav text:nth-child(5) {
			width: 36%
		}

		.footer .nav2 {
			border-bottom: 1px solid #ccc;
			padding-bottom: 10rpx;
			margin-top: 20rpx;
			width: 100%;
			display: flex;
			text-align: center;
			align-items: center
		}

		.footer .nav2 text {
			font-size: 24rpx;
		}

		.footer .nav2 text:nth-child(1) {
			width: 16%;
		}

		.footer .nav2 text:nth-child(2) {
			width: 14%
		}

		.footer .nav2 text:nth-child(3) {
			width: 16%
		}

		.footer .nav2 text:nth-child(4) {
			width: 16%
		}

		.footer .nav2 text:nth-child(5) {
			width: 48%
		}

		.receive {
			color: red;
			border-radius: 50px;
			background-color: #ccc;
			width: 74%;
		}

		.nav_head {
			padding: 20rpx 0;
			background-color: #ccc;
			display: flex;
			align-items: center;
		}

		.footer .nav_head text {
			display: inline-block;
			align-items: center;
			text-align: center;
		}

		.footer .nav_head text:nth-child(1) {
			width: 40%
		}

		.footer .nav_head text:nth-child(2) {
			width: 25%
		}

		.footer .nav_head text:nth-child(3) {
			width: 25%
		}

		.nav2_con {
			border-bottom: 1px solid #ccc;
			padding-bottom: 10rpx;
			margin-top: 20rpx;
			width: 100%;
			display: flex;
			text-align: center;
			align-items: center
		}

		.footer .nav2_con text {
			font-size: 24rpx;
		}

		.footer .nav2_con text:nth-child(1) {
			width: 40%;
		}

		.footer .nav2_con text:nth-child(2) {
			width: 25%
		}

		.footer .nav2_con text:nth-child(3) {
			width: 25%
		}
	}
</style>
