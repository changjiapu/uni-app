import request from '../utils/request'
export function prolist(data) { // index
	return request(data, '/smallroutine/program/applet_info').then(res => res)
}
export function getVideo(vid) { // video src
	return request('https://vv.video.qq.com/getinfo?vid=' + vid + "&platform=101001&charge=0&otype=json").then(res => res)
}
export function getSaveSelect(data) { // shop category
	return request(data, '/smallroutine/program/save_select').then(res => res)
}
export function getUserIdentity(data) { //user_center
	return request(data, '/smallroutine/Reward/personal_message').then(res => res)
}
export function getClassifyList(data) { // classify  分类列表
	return request(data, '/api/product/group').then(res => res)
}
export function getClassifyProduct(data) { // classify   分类商品
	return request(data, "/api/product/group_product").then(res => res)
}
export function getProductInfo(data){ //product_detail   产品详情
	return request(data,'/smallroutine/program/product_info').then(res=>res)
}
export function getProductOpenLabel(data){ //product_detail   产品活动 抢购 限购 虚拟 推广奖励 积分
	return request(data,'/smallroutine/Reward/productOpenLabel').then(res => res)
}
export function fullpresent(data){ //product_detail 满送活动
	return request(data,'/smallroutine/program/fullpresent').then(res=>res)
}
export function fullCut(data){ //product_detail 满减活动
	return request(data,'/smallroutine/program/fullCut').then(res=>res)
}
export function coupon(data){ //product_detail 优惠券
	return request(data,'/smallroutine/program/coupon').then(res=>res)
}
export function MemberPrice(data){ //product_detail 会员价格
	return request(data,'/smallroutine/reward/MemberPrice').then(res=>res)
}
export function product_evaluations(data){ //product_detail  产品评论
	return request(data,'/smallroutine/program/product_evaluations').then(res=>res)
}
export function check_collect(data){ //product_detail  产品收藏
	return request(data,'/smallroutine/program/check_collect').then(res=>res)
}
export function getCoupon(data){//product_detail  领取优惠券
	return request(data,'/smallroutine/program/get_coupo').then(res=>res)
}
export function checkCollage(){//product_detail
	return request(data,'/smallroutine/Reward/check_collage').then(res=>res)
}
export function ScoreRecord(data) { // 积分
	return request(data, "/smallroutine/Reward/score_record").then(res => res)
}

export function articleSlide (data) { // 文章列表页轮播图
    return request(data, "/smallroutine/program/sildeShow")
}
export function articleList (data) { // 文章列表页列表
	return request(data, "/smallroutine/program/Article_list")
}
export function articleOrder (data) { // 文章付费
   return request(data, "/api/order/video_order").then(res => res)
}
// 拼团
export function collageProduct(data) {
	return request(data, "/smallroutine/Reward/collage_product").then(res => res)
} 
// 用户中心
export function myOrder (data) { // 我的订单
	return request(data, "/smallroutine/program/order_status").then(res => res)
}
//我的足迹
export function footPrint (data) {
	return request(data, "/smallroutine/program/footprint").then(res => res)
}
export function delFootprint (data) {
	return request(data, "/smallroutine/program/footprint_del").then(res => res)
}
//我的收藏
export function myCollect (data) {
	return request(data, "/smallroutine/program/supply_collect").then(res => res)
}
export function delCollect (data) {
	return request(data, "/smallroutine/program/check_collect").then(res =>res)
}
//收货地址
export function address (data) {
	return request(data, "/api/address/list").then(res => res)
}
export function setDefault (data) {
	return request(data, "/api/address/set_default").then(res => res)
}
export function delAddress (data) {
	return request(data, "/api/address/del").then(res => res)
}
export function NewAddress (data) {
	return request(data, "/api/address/add").then(res => res)
}
export function EditAddr(data) {
	return request(data, "/api/address/edit").then(res => res)
}
//结算中心 create-order
export function payType(data){ //支付方式
	return request(data,"/smallroutine/program/pay_type").then(res=>res)
}
export function scoreSelect(data){ //用户积分
	return request(data,'/smallroutine/program/score_select').then(res=>res)
}
export function sendMoneya (data){ //运费
	return request(data,'/smallroutine/program/sendMoneya').then(res=>res)
}
export function fullCutHandle(data){ //优惠多少
	return request(data,'/smallroutine/program/fullCutHandle').then(res=>res)
}
export function Jurisdi(data){ //购物币
	return request(data,'/smallroutine/program/Jurisdi').then(res=>res)
}
export function getExplain(data){ //
	return request(data,'/smallroutine/Reward/getExplain').then(res=>res)
}
export function TodayBuy(data){
	return request(data,'/smallroutine/reward/TodayBuy').then(res=>res)
}
export function Create(data){//下单
	return request(data,'/api/order/create').then(res=>res)
}
export function payList(data) { // 支付列表
   return request(data, "/smallroutine/reward/pay_type").then(res => res)
}
export function paySet(data) { // 获取支付密码
   return request(data, "/smallroutine/program/pay_set").then(res => res)
}
export function payPass(data){//保存密码
	return request(data,'/smallroutine/program/pay_pass')
}
export function personalPay(data){
	return request(data,'/api/order/personal_pay').then(res => res)
}
export function productVirtual(data){
	return request(data,'/api/order/product_virtual').then(res=>res)
}
export function sendPhoneMsg (data) { // 发送验证码
	return request(data, "/smallroutine/reward/send_phone_msg").then(res => res)
}

export function vipCard(data){//获取会员卡
	return request(data,'/weixinpl/mshop/vip_card.class.php').then(res=>res)
}
export function showCard(data){
	return request(data,'/smallroutine/Reward/show_card').then(res=>res)
}
export function scoreSign(data){
	return request(data,'/smallroutine/Reward/score_sign').then(res=>res)
}
export function singOnclik(data){ //领取今日积分
	return request(data,'/smallroutine/Reward/singOnclik').then(res=>res)
}

export function GroupList (data) {
	return request(data, "/api/product/group").then(res => res)
}

//分销中心
export function Distribution (data) {
	return request(data, "/smallroutine/Reward/distribution").then(res => res)
}

//我的资产
export function TotalAssets (data) {
	return request(data, "/api/consume/my_total_assets").then(res => res)
}
export function SwitchWork (data) {
	return request(data, "/smallroutine/program/switch_work").then(res => res)
}
export function UserCoupon (data) {
	return request(data, "/smallroutine/program/user_coupon").then(res => res)
}
export function VipCard (data) {
	return request(data, "/weixinpl/mshop/vip_card.class.php").then(res => res)
}
export function myCurrencyList (data){//购物币
	return request(data,'/api/consume/my_currency_list').then(res=>res)
} 
export function shopping_mone(data){//购物币
	return request(data,'/smallroutine/Reward/shopping_money').then(res=>res)
}

//搜索
export function searchList (data) {
	return request(data, "/smallroutine/program/product_order").then(res => res)
}

export function CancelOrder (data) {
	return request(data, "/api/order/cancel").then(res => res)
}

export function orderDetail (data) { // 订单详情
	return request(data, "/smallroutine/program/order_index").then(res => res)
}

export function orderRemind (data) {
	return request(data, "/api/order/shop_remind").then(res => res)
}
//我的团队
export function myTeam (data){
	return request(data,'/smallroutine/Reward/myTeam').then(res=>res)
}
export function cardIdentity(data){
	return request(data,'/smallroutine/Reward/cardIdentity').then(res=>res)
}

export function Refund (data) {
	return request(data, "/api/order/refund").then(res => res)
}

export function MyProfit (data) { // 累积收益
	return request(data, "/smallroutine/Reward/my_profit").then(res => res)
}

export function confirmOrder (data) {
	return request(data, "/api/order/confirm_order").then(res => res)
}

export function MoneyCash (data) {
	return request(data, "/smallroutine/Reward/money_tocash").then(res => res)
}

export function SavePayAccount (data) {
	return request(data, "/smallroutine/Reward/save_pay_account").then(res => res)
}

export function MyAlipay (data) {
	return request(data, "/smallroutine/Reward/my_alipay").then(res => res)
}

export function BagOrderList (data) {
	return request(data, "/smallroutine/reward/pake_order_list").then(res => res)
}

export function BagOrderDetail (data) {
	return request(data, "/smallroutine/reward/pake_order_detail").then(res => res)
}

export function Comment (data) {
	return request(data, "/smallroutine/program/evel").then(res => res)
}

export function BagConfirm (data) {
	return request(data, "/weixinpl/mshop/save_order_confirm.php").then(res => res)
}

export function BagConcel (data) {
	return request(data, "/weixinpl/mshop/save_package_order_cancel.php").then(res => res)
}

export function profitDetail (data) {
	return request(data, "/smallroutine/Reward/profit_detail").then(res => res)
} 
export function Private_store (data){
	return request(data,"/smallroutine/program/Private_store").then(res=>res)
}
export function codePicture (data){
	return request(data,'/smallroutine/Appregister/codePicture').then(res=>res)
}