import store from '../store'
import { requestURL } from './config'
let user = {
	user_type: 3,
	customer_id: ''
}
function getType(user, data, method) { // 获取请求方式
	let type = {}
	if (!method) {
		method = 'post'
		type = {
			method,
			data: {
				...user,
				...data
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			}
		}
	} else {
		method = 'get'
		type = {
			method,
			params: {
				...data
			}
		}
	}
	return type
}

function Request(data, url, method) {
	user.customer_id = store.state.userInfo.customer_id || ''
	// #ifdef MP-WEIXIN
	user.user_type = 1
	// #endif
	return new Promise((resolve, reject) => {
		//uni.showLoading()
		uni.request({
			url: requestURL + url,
			...getType(user, data, method),
			success: res => {
				resolve(res)
			},
			fail: err => {
				//uni.hideLoading()
				console.log('err')
				reject(err)
			}
		})
	}).catch(err => console.log(err))
}


export default function(data, url, method) {
	return Request(data, url, method)
}