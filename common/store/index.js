import Vue from 'vue'
import Vuex from 'vuex'

import { getSaveSelect } from '../api'
import { GetAppId, Login, WeixinLogin } from '../api/login'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		dianpuleibie: 0,
		userInfo: {},
		isRegister: 1, // 1：能注册，0：不能注册
		isParentRegister: 1 // 1：必须要推荐人ID，0：可以有推荐人ID 

	},
	mutations: {
		SET_SHOPLIST: (state, dianpuleibie) => {
			state.dianpuleibie = dianpuleibie
		},
		SET_REGISTER: (state, isRegister) => {
			state.isRegister = isRegister
		},
		SET_REGISTERID: (state, isParentRegister) => {
			state.isParentRegister = isParentRegister
		},
		SET_USERINFO: (state, userInfo) => {
			state.userInfo = Object.assign({}, state.userInfo, userInfo) 
		}
	},
	actions: {
		getShopId ({ commit }, appid) {
			return new Promise((resolve, reject) => {
				getSaveSelect({ appid }).then(res => {
					if (res.statusCode === 200) {
						commit('SET_SHOPLIST', res.data.message)
					}
				}).catch(err => reject(err))
			})
		},
		getAppid ({ commit }, appid) {
			return new Promise((resolve, reject) => {
				GetAppId({ appid }).then(res => {
					if (!res.data.code) {
						const data = res.data.data
						let userInfo = {}
						userInfo.customer_id = data.customer_id
						commit('SET_USERINFO', userInfo)
						commit('SET_REGISTER', data.is_app_register)
						commit('SET_REGISTERID', data.is_parent_register)
						resolve(true)
					}
				})
			})
		},
		userLogin ({ commit }, info) {
			return new Promise((resolve, reject) => {
				Login(info).then(res => {
					if (res.data.status) {
						const data = res.data.data
						let userInfo = {}
						userInfo.nickName = data.information.name
						userInfo.phone = data.information.phone
						userInfo.avatarUrl = data.information.weixin_headimgurl
						userInfo.id = data.information.user_id
						userInfo.ticket = data.ticket
						userInfo.uname = data.uname
						userInfo.rank = data.cardEnti
						commit('SET_USERINFO', userInfo)
						uni.setStorageSync('userInfo', userInfo)
						resolve(res.data.status)
					} else {
						resolve(false)
					}
				}).catch(err => { reject(err) })
			})
		},
		WeiXinLogin ({ commit, state }, db) {
			uni.showLoading()
			const customer_id = state.userInfo.customer_id
			uni.getProvider({
				service: 'oauth',
				success: res => {
					if (~res.provider.indexOf('weixin')) {
						uni.login({
							provider: 'weixin',
							success: rst => {
								uni.getUserInfo({
									provider: 'weixin',
									success: info => {
										let params = {
											...info.userInfo,
											customer_id,
											referrer: db.referrer
										}
										WeixinLogin(params).then(result => {
											uni.hideLoading()
											if (result.data.status) {
												const data = result.data.data
												let userInfo = {
													...info.userInfo
												}
												userInfo.nickName = data.information.weixin_name
												userInfo.phone = data.information.phone
												userInfo.avatarUrl = data.information.weixin_headimgurl
												userInfo.id = data.information.user_id
												userInfo.ticket = data.ticket
												userInfo.uname = data.uname
												userInfo.openid = info.userInfo.openId
												commit('SET_USERINFO', userInfo)
												uni.setStorageSync('userInfo', userInfo)
												uni.redirectTo({
													url: '/pages/index/index'
												})
											} else {
												uni.showModal({
													title: '',
													content: result.data.msg,
													showCancel: false,
													success: res => {
														if (res.confirm) {
															db.callback(true)
														}
													}
												})
											}
										})
									}
								})
							}
						})
					}
				}
			})
		},
		logout ({ state }) {
			uni.showModal({
				title: '',
				content: '确认退出登录吗?',
				success: res => {
					if (res.confirm) {
						uni.setStorageSync('userInfo', {})
						state.userInfo.avatarUrl = ''
						state.userInfo.id = ''
						state.userInfo.nickName = ''
						state.userInfo.ticket = ''
						state.userInfo.uname = ''
						state.userInfo.rank = []
						uni.reLaunch({
							url: '/pages/index/index'
						})
					}
				}
			})
		}
	}
})

export default store