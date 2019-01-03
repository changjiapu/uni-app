import store from '../store'
export default {
	gotoLogin:()=>{
		return new Promise((resolve, reject) => {
			if (store.state.userInfo.id) {
				resolve(true)
			} else {
				uni.showModal({
					title: '',
					content: '请您先登录',
					success: res => {
						if (res.confirm) {
							// #ifdef MP-WEIXIN
							uni.navigateTo({
								url: '/pages/login/getUserInfo'
							})
							// #endif
							// #ifndef MP-WEIXIN
							uni.navigateTo({
								url: '/pages/login/index'
							})
							// #endif
						} else {
							//uni.navigateBack()
						}
					}
				})
				resolve(false)
			}
		})
	},
	LinkTo: (item) => {
		switch (item.link) {
			case '拼团页面':
				uni.navigateTo({
					url: '/pages/tour_diy/index',
				})
				break;
			case '抢购页面':
				uni.navigateTo({
					url: '/packageB/pages/Buy-limit',
				})
				break;
			case '礼包列表':
				uni.navigateTo({
					url: '/packageA/pages/bigBag/index'
				})
				break;
			case '签到积分':
				uni.navigateTo({
					url: '/pages/integral/index',
				})
				break;
			case '购物币':
				uni.navigateTo({
					url: '/pages/currency-history',
				})
				break;
			case '优惠券':
				uni.navigateTo({
					url: '/pages/coupon2',
				})
				break;
			case '会员卡':
				uni.navigateTo({
					url: '/pages/my-member',
				})
				break;
			case '续费专区':
				uni.navigateTo({
					url: '/packageA/pages/renew',
				})
				break;
			case '视频专区':
				uni.navigateTo({
					url: '/packageB/pages/videoList/index',
				})
				break;
			case '阅读专区':
				uni.navigateTo({
					url: '/packageB/pages/articleList/index',
				})
				break;
			case '个人中心：我的订单':
				if (store.state.dianpuleibie == 5 || store.state.dianpuleibie == 1) {
					uni.navigateTo({
						url: '/pages/my-order?tab=0'
					})
				} else if (store.state.dianpuleibie == 2) {
					uni.navigateTo({
						url: '/packageB/pages/order2'
					})
				} else if (store.state.dianpuleibie == 4) {
					uni.navigateTo({
						url: '/packageB/pages/order4',
					})
				}
				break;
			case '个人中心：我的足迹':
				uni.navigateTo({
					url: '/pages/my-footprint'
				})
				break;
			case '个人中心：我的收藏':
				uni.navigateTo({
					url: "/pages/my-collect"
				})
				break;
			case '个人中心：收货地址':
				uni.navigateTo({
					url: '/pages/address'
				})
				break;
			case '个人中心：我的资产':
				uni.navigateTo({
					url: '/pages/money'
				})
				break;
			case '个人中心：编辑资料':
				uni.navigateTo({
					url: '/packageB/pages/set_message'
				})
				break;
			case '个人中心：在线客服':
				uni.navigateTo({
					url: '/packageB/pages/online-service'
				})
				break;
			case '个人中心：邀请小伙伴':
				uni.navigateTo({
					url: '/packageB/pages/share-app'
				})
				break;
			case '个人中心：我的赠送':
				uni.navigateTo({
					url: '/pages/my-give'
				})
				break;
			case '个人中心：我的特权':
				uni.navigateTo({
					url: '/packageA/pages/my-privilege'
				})
				break;
			case '个人中心：分销中心':
				uni.navigateTo({
					url: '/pages/my-collage'
				})
				break;
			case '个人中心：拼团':
				uni.navigateTo({
					url: '/pages/distribution-center'
				})
				break;
		}
		if (item.type_id && store.state.dianpuleibie == 5) {
			uni.navigateTo({
				url: '/pages/productList/index?typeid=' + item.type_id,
			})
		} else if (item.supplyId && store.state.dianpuleibie == 1) {
			uni.navigateTo({
				url: '/pages/shop?id=' + item.supplyId,
			})
		} else if (item.type_id && store.state.dianpuleibie == 1) {
			uni.navigateTo({
				url: '/pages/shop-list?id=' + item.type_id + '&name=' + item.link,
			})
		} else if (item.pid && (store.state.dianpuleibie == 1 || store.state.dianpuleibie == 5)) {
			uni.navigateTo({
				url: '/pages/product_detail/product_detail?pid=' + item.pid + '&supply_id=' + item.supply_id
			})
		} else if (item.supply_id || item.type_id && this.store.state.dianpuleibie == 2) {
			uni.navigateTo({
				url: '/packageB/pages/shop2?supply_id=' + item.supply_id + '&type_id=' + item.type_id
			})
		}

	},
	//函数节流
	throttle: (fn, gapTime) => {
		if (gapTime == null || gapTime == undefined) {
			gapTime = 2000
		}
		let _lastTime = null
		return function() {
			let _nowTime = +new Date()
			if (_nowTime - _lastTime > gapTime || !_lastTime) {
				fn.apply(this, arguments) //将this和参数传给原函数
				_lastTime = _nowTime
			}
		}
	}
}
