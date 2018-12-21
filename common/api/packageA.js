import request from '../utils/request'

export function PackageList (data) {
	return request(data, "/smallroutine/reward/package_list")
}

//我的特权
export function myPrivilege (data) {
	return request(data, "/smallroutine/Reward/my_privilege").then(res => res)
}

export function Upgrade (data) {
	return request(data, "/smallroutine/Reward/promoter_upgrade").then(res => res)
}

export function packageList (data) {
	return request(data, "/smallroutine/reward/package_list").then(res => res)
}

// 大礼包详情

export function packageDetail (data) {
	return request(data, "/smallroutine/reward/product_detail_gift").then(res => res)
}
export function orderFormGift(data){
	return request(data,'/smallroutine/reward/order_form_gift').then(res=>res)
}
export function savePackages(data){
	return request(data,'/smallroutine/reward/save_packages').then(res=>res)
}
export function packagePay(data){
	return request(data,'/smallroutine/reward/pay').then(res=>res)
}

export function StoreRewar (data) {
	return request(data, "/smallroutine/Reward/store_reward").then(res => res)
}

export function sHugrade (data) {
	return request(data, "/weixinpl/mshop/shareholder_upgrade.php").then(res => res)
}

export function cash (data) {
	return request(data, "/smallroutine/Reward/cash").then(res => res)
}

export function cashMoney (data) {
	return request(data, "/smallroutine/Reward/save_tocash").then(res => res)
}

export function cashLog (data) {
	return request(data, "/smallroutine/Reward/my_cash_log").then(res => res)
}