import request from '../utils/request'

export function videoList(data) { // 视频列表
	return request(data, "/smallroutine/Program/video_list").then(res => res)
}

export function addfavorite(data) { // 视频收藏
	return request(data, "/smallroutine/program/videoCollect").then(res => res)
}

export function videoComment(data) { // 视频评论列表
	return request(data, "/smallroutine/Program/video_comment").then(res => res)
}

export function faBuLoues(data) { // 评论点赞
	return request(data, "/smallroutine/program/fabulous").then(res => res)
}

export function AddComment(data) { // 添加评论
	return request(data, "/smallroutine/Program/add_comment").then(res => res)
}

export function payList(data) { // 支付列表
	return request(data, "/smallroutine/reward/pay_type").then(res => res)
}

export function getPwd(data) { // 获取支付密码
	return request(data, "/smallroutine/program/pay_set").then(res => res)
}

export function payWay(data) { // 支付
	return request(data, "/api/order/PayMoney").then(res => res)
}

// 个人资产 -- 记录
export function CurrencyRecord(data) {
	return request(data, "/smallroutine/reward/currencyRecord").then(res => res)
}

// 资料编辑
export function getUserInfo(data) {
	return request(data, "/api/member/get_userinfo").then(res => res)
}

export function EditUserInfo(data) {
	return request(data, "/api/member/edit_userinfo").then(res => res)
}
//团队队员详情
export function TeamPerson(data) {
	return request(data, '/smallroutine/Reward/team_person').then(res => res)
}
// 物流信息
export function expressData(data) {
	return request(data, '/smallroutine/program/expressData').then(res => res)
}

export function articleDetail(data) {
	return request(data, "/smallroutine/program/article_reading_volume").then(res => res)
}
