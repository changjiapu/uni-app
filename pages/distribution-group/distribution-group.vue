<template>
	<view class="container">
		<view class='top'>
			<view class='search'>
				<view class='head'>
					<uni-icon type="search" size="30"></uni-icon>
					<input type='text' placeholder='请输入用户名或者用户id' placeholder-style="color:#ccc" @input='keywordChange'></input>
				</view>
				<view class='search-btn' @click='searchProduct'>搜索</view>
			</view>
			<view class='search'>
				<view class='kaiguan' @click='openCloaking'>
					<image :src="baseURL+'/weixinpl/shopping-temp/images/shipping.png'" style='height:40upx;width:50upx;'></image>
					<text>全部</text>
				</view>
<!-- 				<text>团队总人数：{{rcount}}</text> -->
			</view>
		</view>
		<empty-data v-if='myteam.length===0'>~此处空空如也~</empty-data>
		<view class="main">
			<scroll-view class="srx" scroll-y lower-threshold='5px' @scrolltolower="lower">
				<view class='content' @click='gotoDetail(item.id)' v-for="(item,index) in myteam" :key="index">
					<view class='img'>
						<image :src="item.weixin_headimgurl || baseURL + '/weixinpl/shopping-temp/images/default.png'"></image>
					</view>
					<view class='msg'>
						<text style='font-size:16px;'>{{item.user_name}}</text>
						<text style='color:#999' v-if="item.parent_name">推荐人：{{item.parent_name}}</text>
						<text style='color:#666;font-size:14px;'>{{item.sq_time}}</text>
						<view>
							<text class="card1 itemWrapper" v-if="item.exp_name">{{item.exp_name}}</text>
							<text class="card2 itemWrapper" v-if="item.shareholder_name">{{item.shareholder_name}}</text>
							<text class="card3 itemWrapper" v-if="item.isAgent">{{item.isAgent}}</text>
						</view>
					</view>
					<view class='icon'>
					</view>
				</view>
			</scroll-view>
		</view>
		<uni-drawer class="draw" :visible="kaiguan" mode="right" @close="ToggleDrawer">
			<view class="clist">
				<view class='head'>
					<text>角色</text>
					<text style='color:#ccc'>当前选择</text>
					<text>{{currentName}}</text>
				</view>
				<!-- 角色 start-->
				<view class='catrgory'>
					<view :class="{active:currentid==item.id}" v-for="(item,index) in gradeOpen" :key='index' @click='currentXzChange(item)'>{{item.name}}</view>
				</view>
				<!-- 角色 end-->
				<!-- 初级start -->
				<view class='head' v-if="currentid=='1'">
					<text>{{proSonName}}</text>
				</view>
				<view class='catrgory' v-if="currentid=='1'">
					<view :class="{active:proSonid=='1'}" data-id='1' @click='updateSubset(params)'>全部</view>
					<view :class="{active:proSonid==item.id}" v-for="(item,index) in promoters" :key='index' @click='updateSubset(item)'>{{item.exp_name}}</view>
				</view>
				<!-- 初级end -->
				<!-- 店铺 -->
				<view class='head' v-if="currentid=='3'">
					<text>{{proSonName}}</text>
				</view>
				<view class='catrgory' v-if="currentid=='3'">
					<view :class="{active:proSonid==item.id}" v-for="(item,index) in shareholder" :key='index' @click='updateSubset(item)'>{{item.name}}</view>
				</view>
				<!-- 店铺end -->
				<view class='head'>
					<text>初级身份</text>
					<text style='color:#ccc'>当前选择</text>
					<text>{{commisionsName}}</text>
				</view>
				<view class='catrgory'>
					<view :class="{active:commisionsid=='0'}" @click='upCommisions(params2)'>全部</view>
					<view :class="{active:commisionsid==item.id}" v-for="(item,index) in commisions" :key='index' @click='upCommisions(item)'>{{item.name}}</view>
				</view>
				<button @click='gotoConfirm'>确定</button>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		myTeam,
		cardIdentity
	} from '@/common/api'
	import uniDrawer from '@/components/uni-drawer'
	import uniIcon from "@/components/uni-icon"
	import {
		baseURL
	} from '@/common/utils/config'
	export default {
		components: {
			uniIcon,
			uniDrawer
		},
		data() {
			return {
				baseURL: baseURL,
				currentid: '0',
				currentName: '全部',
				commisionsid: '0',
				commisionsName: '全部',
				kaiguan: false,
				myteam: '',
				rcount: '',
				gradeOpen: '', //查询股东身份
				commisions: '', //查询推广员等级
				promoters: '', //查询推广员等级
				shareholder: '', //查询开启的哪些角色
				proSonid: '0',
				proSonName: '全部',
				search_text: '',
				page: 1,
				params: {
					id: 1,
					exp_name: '全部'
				},
				params2: {
					id: 0,
					name: '全部'
				},
				hg: ''
			};
		},
		onLoad() {
			let res = uni.getSystemInfoSync()
			this.my_Team(1, 0, 0)
			cardIdentity().then(res => {
				if (!res.data.code) {
					this.gradeOpen = res.data.data.gradeOpen
					this.commisions = res.data.data.commisions
					this.promoters = res.data.data.promoters
					this.shareholder = res.data.data.shareholder
				}
			})
		},
		methods: {
			my_Team(pages, commisions_val, choose_val) {
				let sendData = {
					user_id: this.userInfo.id,
					page: pages,
					commisions_val: commisions_val, //初级身份
					choose_val: choose_val //角色
				}
				uni.showLoading()
				myTeam(sendData).then(res => {
					uni.hideLoading()
					if (!res.data.code) {
						this.myteam = res.data.data
						this.rcount = res.data.rcount
						this.page++
					}
				})
			},
			openCloaking() {
				this.kaiguan = true
			},
			ToggleDrawer() {
				this.kaiguan = false
			},
			currentXzChange(e) {
				console.log(e)
				let currentid = e.id
				let currentName = e.name
				this.currentid = currentid,
					this.currentName = currentName

				if (currentid == 1) {
					this.proSonid = 1
				}
				if (currentid == 3) {
					this.proSonid = 30
					this.proSonName = '全部'

				}
			},
			updateSubset(e) {
				console.log(e)
				let proSonid = e.id
				let proSonName = e.exp_name
				this.proSonid = proSonid
				this.proSonName = proSonName

			},
			upCommisions(e) {
				let commisionsid = e.id
				let commisionsName = e.name
				this.commisionsid = commisionsid
				this.commisionsName = commisionsName

			},
			gotoConfirm() {
				let currentid = this.currentid
				console.log(this.currentid)
				let commisions_val = this.commisionsid
				if (currentid == 1 || currentid == 3) {
					var choose_val = this.proSonid
				} else {
					var choose_val = this.currentid
				}
				this.my_Team(1, commisions_val, choose_val);
				this.kaiguan = false

			},
			keywordChange(e) {
				this.search_text = e.detail.value
			},
			searchProduct() {
				let sendData = {
					user_id: this.userInfo.id,
					customer_id: this.userInfo.customer_id,
					page: 1,
					search_text: this.search_text,
					commisions_val: 0,
					choose_val: 0
				}
				uni.showLoading()
				myTeam(sendData).then(res => {
					uni.hideLoading()
					if (!res.data.code) {
						this.myteam = res.data.data
					}
				})
			},
			gotoDetail(e) {
				let id = e
				uni.navigateTo({
					url: '/packageB/pages/Team_detail/Team_detail?id=' + id,
				})
			},
			lower() {
				var page = this.page
				var currentid = this.currentid
				var commisions_val = this.commisionsid
				if (currentid == 1 || currentid == 3) {
					var choose_val = this.proSonid
				} else {
					var choose_val = this.currentid
				}
				var sendData = {
					user_id: this.userInfo.id,
					page: page,
					search_text: this.search_text,
					commisions_val: commisions_val,
					choose_val: choose_val
				}
				uni.showLoading()
				myTeam(sendData).then(res => {
					uni.hideLoading()
					if (!res.data.code) {
						this.myteam = [...this.myteam, ...res.data.data];
						this.rcount = res.data.rcount
						this.page++
						if (!res.data.data.length && this.page !== 1) {
							uni.showToast({
								title: '没有更多数据啦>_<',
								icon: 'none'
							})
						}
					}
				})
			},
		},
		computed: {
			...mapState([
				'userInfo'
			])
		}

	}
</script>

<style lang="less">
	@import '../../common/css/variables.less';

	uni-body-page,
	page {
		height: 100%;
	}

	.container {
		height: 100%;
		width: 100%;
		overflow: hidden;
		display: flex;
		flex-flow: column;
		position: absolute;
		top: 0;
		bottom: 0;
		.top {
			.search {
				padding: 20upx;
				display: flex;
				justify-content: space-between;

				.kaiguan {
					display: flex;
					align-items: center;
				}

				.head {
					display: flex;
					height: 80upx;
					align-items: center;
					width: 500upx;
					border-radius: 10upx;
					border: 1px solid #ccc;
					background-color: #fff;
					position: relative;
				}

				.search-btn {
					height: 80upx;
					line-height: 80upx;
					align-items: center;
					background-color: #fff;
					border: 1px solid #ccc;
					border-radius: 10upx;
					text-align: center;
					width: 150upx;
				}
			}
		}


		.main {
			flex: 1;
			overflow: hidden;

			.srx {
				height: 100%;

				.content {
					padding-left: 10upx;
					padding-top: 15upx;
					padding-bottom: 15upx;
					border-bottom: 1px solid #ccc;
					background-color: #FFF;
					display: flex;
					align-items: center;
					position: relative;

					.img {
						image {
							width: 150upx;
							height: 150upx;
							border-radius: 100upx;
						}
					}

					.msg {
						margin-left: 15upx;
						display: flex;
						flex-direction: column;

						.itemWrapper {
							margin-top: 5px;
							margin-right: 4px;
							padding: 4px 5px;
							border-radius: 3px;
							font-size: 12px;
							color: white;
							width: 29%;
							overflow: hidden;
							height: 20px;
						}

						.card1 {
							background: #53AF4F;
						}

						.card2 {
							background: #FA7E23;
						}

						.card3 {
							background: red;
						}
					}

					.icon {
						height: 40upx;
						width: 40upx;
						background-image: url('@{URL}/weixinpl/shopping-temp/images/arrows-right.png');
						background-size: contain;
						position: absolute;
						right: 20upx;
					}
				}
			}
		}
	}
</style>
