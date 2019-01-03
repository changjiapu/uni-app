<template>
	<view>
		<view :class="{active2: actionSheetHidden || showtankuang || showhaibao}">
			<view class='loading-content' style='height:220upx' v-if="isloading">
				<view class='loader2'></view>
				<text class='loading-tips'>加载中...</text>
			</view>
			<block v-else>
				<swiper indicator-dots="true" indicator-color="#eee" indicator-active-color="#0099FF" style='height:750upx;' v-if="dianpuleibie==5">
					<block v-if="product.product_img.length>0">
						<swiper-item v-for="(item,index) in product.product_img" :key="index">
							<image :src='item.imgurl' style='width:100%;height:100%'></image>
						</swiper-item>
					</block>
					<block v-else>
						<swiper-item>
							<image :src="baseURL+'/weixinpl/shopping-temp/images/default.jpg'" style='width:100%;height:100%'></image>
						</swiper-item>
					</block>
				</swiper>
				<swiper indicator-dots="true" indicator-color="#eee" indicator-active-color="#00kuanshi99FF" style='height:750upx;'
				 v-if="dianpuleibie==1">
					<block v-if="product_img.length>0">
						<swiper-item v-for="(item,index) in product_img" :key='index'>
							<image :src="item.banner_imgurl" style='width:100%;height:100%'></image>
						</swiper-item>
					</block>
					<block v-else>
						<swiper-item>
							<image :src="baseURL+'/weixinpl/shopping-temp/images/default.jpg'" style='width:100%;height:100%'></image>
						</swiper-item>
					</block>
				</swiper>
				<view class="groupTime" v-if="issnapup==1">
					{{robTime.title}}{{robTime.countDownDay}}天{{robTime.countDownHour}}:{{robTime.countDownMinute}}:{{robTime.countDownSecond}}
				</view>
				<view class='product-name'>
					<view>
						{{product.data.name||current_product.name}} {{product.data.remarks}}
						<text class='collageTag' v-if="groupInfo.type==1">普通团</text>
						<text class='collageTag' v-if="groupInfo.type==2">抽奖团</text>
						<text class='collageTag' v-if="groupInfo.type==3">秒杀团</text>
						<text class='collageTag' v-if="groupInfo.type==4">超级团</text>
					</view>
				</view>
				<view class='price'>
					<view class='left'>
						<text v-if="groupInfo.price" class='now-price'>￥{{groupInfo.price}}</text>
						<text v-else class='now-price'>
							￥{{current_product.now_price}}
							<text v-if="current_product.need_score" style="font-size:12px;">+{{current_product.need_score}}积分</text>
						</text>
						<text class='origal-price'>￥{{current_product.orgin_price}}</text>
						<text class="islimit" v-if="islimit==1"> {{limitData.limit_days}}天内限{{limitData.limit_num}}件</text>
					</view>
					<view v-if="groupInfo.stock" class='right'>库存{{groupInfo.stock}}件</view>
					<view v-else class='right'>库存{{current_product.storenum}}件</view>
					<view class='right'>已售{{current_product.sell_count+current_product.show_sell_count}}</view>
					<view class='fenxiang' @click="bottomtankuang">
						<image :src="baseURL+'/weixinpl/shopping-temp/images/share.png'"></image>
						<text>分享</text>
					</view>
				</view>
				<!-- 店铺名称 -->
				<view class='shop-title' v-if="dianpuleibie==1">
					<image class='img' :src='shop_detail.logo' style='height:100upx;width:200upx;'></image>
					<text>{{shop_detail.shop_name}}</text>
					<image @click='phone(shop_detail.username)' class='icon' src='/images/phone.png' style='height:50upx;width:50upx;margin-right:20upx'></image>
				</view>
				<!-- 满送活动 -->
				<view class='activity1 activity' v-if="activity">
					<view class='activity-item'>
						<text>{{message}}</text>
					</view>
				</view>
				<!-- 满减活动 -->
				<view class='activity1 activity' v-if="activity2">
					<view class='activity-item'>
						<text>{{message2}}</text>
					</view>
				</view>
				<view class='activity2 activity' @click='actionSheetChange' v-if="ofCoupon">
					<view class='activity-item'>
						<text>优惠劵</text>
					</view>
					<view class="arrows-right">
						<image :src="baseURL+'/shopping-temp/images/arrows-right.png'" style='width:100%;height:100%'></image>
					</view>
				</view>
				<view class='select-product' @click='showProductProperty'>
					<view class='left'>
						已选
						<text>{{buy_count}}件</text>

					</view>
					<view :class="['arrows-right', {active:hidden_property}]">
						<image :src="baseURL+'/weixinpl/shopping-temp/images/arrows-right.png'" style='width:100%;height:100%'></image>
					</view>
				</view>
				<view class='product-property' :style="{display:hidden_property ? 'none' : ''}">
					<view class='product-count list'>
						<text>数量:</text>
						<view class='list-cont'>
							<text class='sub' @click='sub'>-</text>
							<input type='number' :value="buy_count" @blur='inputBuycount'></input>
							<text class='add' @click='add'>+</text>
						</view>
					</view>
					<view class='cont'>
						<!--属性循环-->
						<view class='neirong' v-if="dianpuleibie==5">
							<!-- 			<view v-for="(item,index) in pros_data" :key="index" class='container' v-if="product.product_prices.length">
								<text class="mingcheng">{{item.name}}</text>
								<text :class="['kuanshi', {act: pros_data.act}]" v-for="(pros_data,idx) in item.parent_pros" :key="idx" @click='ProsChange(item, idx,index)'>
									{{pros_data.name}}
								</text>
							</view> -->
							<radio-group v-for="(item,index) in pros_data" :key="index" class='container' v-if="product.product_prices.length"
							 @change="radioChange($event, index)">
								<text class="mingcheng">{{item.name}}</text>
								<label class="radio" v-for="(pros_data,idx) in item.parent_pros" :key="idx">
									<radio color='#CC3333' :value="pros_data.name" />{{pros_data.name}}
								</label>
							</radio-group>
						</view>
					</view>
				</view>
				<!-- 拼团 -->
				<!-- 								<view v-if="getExplain&&getExplain.status==1&&group">
					<view class='select-product' @click='groupGet'>
						<view class='left'>
							{{getExplain.title}}
						</view>
						<view :class="['arrows-right', {active:groupState}]">
							<image src='/images/arrows-right.png' style='width:100%;height:100%'></image>
						</view>
					</view>
					<view :style="{display:groupState?'none':'',padding:15+'px'}">
						<text>活动时间:{{getExplain.createtime}}</text>
						<rich-text :nodes="nodes"></rich-text>
					</view>
				</view>
				<view class="gr" v-if="group">
					<view class='group-product' @click='popularCollage'>
						<view class="group-product-head">
							<view>小伙伴的拼团,你可以参加噢!
								<text style="float:right;">人气拼团></text>
							</view>
						</view>
					</view>
					<swiper class="group-con" autoplay="true" interval="3500" duration="1000" style="height:80px;">
						<block v-for="(item,index) in groupsNum" :key="index">
							<swiper-item>
								<view class="group-con-img">
									<image :src="item.weixin_headimgurl"></image>
								</view>
								<view class="groupsName">
									<view>{{item.weixin_name}}</view>
									<view>{{item.province}}</view>
									<view>剩余时间:{{item.countDownDay}}天{{item.countDownHour}}:{{item.countDownMinute}}:{{item.countDownSecond}}分</view>
								</view>
								<view class="groupsName">
									<button style="text-align:center;background:#666666;font-size:12px;border-radius:0px;">还差{{item.success_num-item.join_num}}人</button>
									<button style="background:#fe842f;font-size:12px;border-radius:0px;" @click='groupCollage(item.id)'>去参团></button>
								</view>
							</swiper-item>
						</block>
					</swiper>
				</view> -->

				<view class='product-evaluate' v-if="is_open_evaluation">
					<view class='evaluate-title'>
						<text>评价</text>
						<view>
							<text>{{product.data.ratio}}</text>好评
						</view>
					</view>
					<view class='evaluate-cont' @click='gotoEvaluate' v-if="evaluate">
						<view class='evaluate-name'>
							<view class='name'>{{evaluate.weixin_name}}</view>
							<view class='img evaluate' style='width:150rpx;'>
								<view :style="{width:evaluate.level/3*100+'%'}">
									<image mode='widthFix' :src="baseURL+'/weixinpl/shopping-temp/images/grade.png'" style='width:150rpx'></image>
								</view>
							</view>
						</view>
						<view class='evaluate-detail'>
							{{evaluate.discuss}}
						</view>
						<view class='evaluate-img'>
							<view class='img' v-for="(item,index) in evaluate.discussimg" :key="index" v-if="item" catchtap='previewImage(item)'>
								<image mode='aspectFit' :src='item' style='width:100%;height:100%'></image>
							</view>
						</view>
						<view class='evaluate-time'>
							<text>{{evaluate.createtime}}</text>
						</view>
					</view>
					<view class='evaluate-bottom' @click='gotoEvaluate'>
						<view>共{{product.data.tol_level}}条评论</view>
						<view class='right'>
							<text>查看更多</text>
							<text>></text>
						</view>
					</view>
				</view>

				<!-- 商品参数 -->
				<view class='product-detail'>
					<text :class="['Detailactive2',{Detailactive:currentDetail==1}]" @click='showProductDetail(1)'>商品详情</text>
					<text :class="['Detailactive2',{Detailactive:currentDetail==2}]" @click='showProductDetail(2)'>商品规格</text>
					<text :class="['Detailactive2',{Detailactive:currentDetail==3}]" @click='showProductDetail(3)'>售后保障</text>
				</view>
				<rich-text v-if="currentDetail==1" :nodes="detail.nodes1" class="detas xianshi"></rich-text>
				<rich-text v-if="currentDetail==2" :nodes="detail.nodes2" class="xianshi"></rich-text>
				<rich-text v-if="currentDetail==3" :nodes="detail.nodes3" class="xianshi"></rich-text>
			</block>
			<view class='empty'></view>
			<view class='bottom-btn2'>
				<view class='shopping-cart' @click='linktoCart'>
					<view class='img'>
						<image :src="baseURL+'/weixinpl/shopping-temp/images/cart2.png'" style='width:100%;height:100%;'></image>
					</view>
					<text>购物车</text>
				</view>
				<view class='shopping-cart' @click='collect'>
					<view class='img'>
						<image v-if="product.data.collect" :src="baseURL+'/weixinpl/shopping-temp/images/collect.png'" style='width:100%;height:100%;'></image>
						<image v-else :src="baseURL+'/weixinpl/shopping-temp/images/collect1.png'" style='width:100%;height:100%;'></image>
					</view>
					<text>收藏</text>
				</view>
				<view class="card" v-if="is_privilege !=2">
					<view class='add-cart' v-if="!group&&issnapup==0&&is_virtual.is_virtual_shop==0&&!is_integral_product" @click='addCarts'>加入购物车</view>
					<view class='add-cart' v-if="is_virtual.is_virtual_shop==1||is_integral_product==1||issnapup==1||robTime.status==0"
					 style="background:#949494">加入购物车</view>
					<view class='add-cart1' v-else-if='group==1' @click='buy(groupInfo.pid)'>发起拼单</view>
					<view class='add-cart1' v-else-if='group==2' @click='buy(groupInfo.pid)'>立即参团</view>
					<view class='bug-now' v-if="!group&&issnapup==0" @click='buy'>立即购买</view>
					<view class='bug-now' v-else-if="!group&&issnapup==1&&robTime.status==0" style="background:#CDB38B">立即购买</view>
					<view class='bug-now' v-else-if="!group&&issnapup==1&&robTime.status==1" @click='buy'>立即购买</view>
					<view class='bug-now1' v-else-if="group==2||group==1" @click='buy'>单独购买</view>
				</view>
				<view class="wxcard" v-else>
					<view class='add_card'>你没有权限购买此产品</view>
				</view>
			</view>

			<!-- 底部弹框 -->
			<view class='tankuang' v-if="showtankuang">
				<view class='container1'>
					<view class='share'>
						<button class='btn' open-type="share">
							<view>
								<image :src="baseURL+'/weixinpl/shopping-temp/images/wechat.png'"></image>
							</view>
							<text>分享给朋友</text>
						</button>
						<view class='btn' @click='ontophaibao'>
							<view>
								<image :src="baseURL+'/weixinpl/shopping-temp/images/erweima.png'"></image>
							</view>
							<text>生成商品海报</text>
						</view>
					</view>
					<view class='close' @click='bottomClose'>关闭</view>
				</view>
			</view>
			<!-- 底部弹框 -->
			<view class="action_sheet" v-if="actionSheetHidden">
				<view class='activity-card'>
					<scroll-view scroll-y>
						<view class='Coupon'>
							<view class='title'>优惠券</view>
							<view class='Coupon-item' v-for="(item,index) in coupon" :key="index">

								<view class="par">
									<view class='sub'>
										<text>￥</text>{{item.MaxMoney}}</view>
									<view class='sub'>
										<view>满{{item.NeedMoney}}使用</view>
									</view>
									<view class='sub' style="font-size:12px;">
										有效期 {{item.nowtime}}-{{item.endtime}}
									</view>

								</view>
								<view class='beizhu'>
									<text>备注：{{item.remark}}</text>
								</view>

								<view class="copy">
									<view @click="onCoupon(item.coupon_id)">立即领取</view>
								</view>
								<text class='round round1'></text>
								<text class='round round2'></text>
								<text class='round round3'></text>
								<text class='round round4'></text>
								<text class='round round5'></text>
								<text class='round round6'></text>
							</view>
						</view>
					</scroll-view>
					<view class='btn' @click='actionSheetChange'>确认</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		baseURL
	} from '@/common/utils/config'
	import {
		getProductInfo,
		getProductOpenLabel,
		fullpresent,
		fullCut,
		coupon,
		MemberPrice,
		product_evaluations,
		check_collect,
		getCoupon,
		checkCollage
	} from '@/common/api/index.js'
	export default {
		data() {
			return {
				baseURL: baseURL,
				detail: {
					nodes1: '', //详情
					nodes2: '', //规格
					nodes3: '' //参数
				},
				flag: false,
				address: '',
				str: '',
				product: {
					data: {},
					product_prices: [],
					pros_data: [],
					product_img: []
				},
				currentDetail: 1,
				hidden_property: false,
				// 当前挑选的产品
				current_select: [],
				buy_count: 1,
				current_product: {},
				isloading: true,
				evaluate: '',
				actionSheetHidden: false,
				activity: false,
				message: "",
				activity2: false,
				message2: "",
				coupon: [], //优惠券
				ofCoupon: false, //优惠券开关
				pros_data: '', //属性结构
				pros_arry: [], //选中属性数组
				product_id: '', //产品ID
				supply_id: '', //店铺ID
				group: '', //是否是拼团产品  //表示是1 开团  2表示参团       
				groupInfo: '', //拼团信息
				groupsNum: [], //拼团人数
				getExplain: '', //拼团说明书
				groupState: false, //说明书的显示隐藏
				group_id: '', //参团才有团id其他为空 
				remain_score: '', //用户积分
				is_privilege: '', //0任何人可以购买 1您可以购买 2你不可以购买
				robTime: {
					title: '',
					countDownDay: '',
					countDownHour: '',
					countDownMinute: '',
					countDownSecond: '',
				},
				issnapup: '', //抢购
				islimit: '', //限购
				limitData: { //限购时间多久
					limit_days: '',
					limit_num: ''
				},
				pay_type: '', //0未设置专属支付方式 1设置
				is_virtual: { //是否是虚拟产品
					is_virtual_shop: '', //商城 
				},
				is_integral_product: '', //积分产品
				extend_money: 0, //首次推广奖励
				showtankuang: false, //底部分享弹框
				showhaibao: false, //
				maskHidden: true,
				showTabBar: '',
				renew_id: '', //默认值为空,有值代表重续费专区进入详情页
				parent_id: '' //推举人id
			};
		},
		onLoad(options) {
			this.product_id = options.pid
			//产品详情
			getProductInfo({
				user_id: this.userInfo.id,
				product_id: options.pid
			}).then(res => {
				this.current_product.need_score = res.data.data.need_score; //所需积分
				this.current_product.now_price = res.data.data.now_price.toFixed(2); // 当前页面产品的现价格
				this.current_product.orgin_price = res.data.data.orgin_price.toFixed(2); // 当前页面产品的原价
				this.current_product.id = res.data.data.id;
				this.current_product.storenum = res.data.data.storenum; // 当前页面产品的库存
				this.current_product.sell_count = res.data.data.sell_count; //当前页面产品的售量
				this.current_product.show_sell_count = res.data.data.show_sell_count
				this.product = res.data;

				res.data.pros_data.forEach(item => {
					this.$set(item, 'act', false)
					this.$set(item, 'list_u', '')
				})
				res.data.product_img.forEach(item => {
					this.$set(item, 'imgurl', item.imgurl.substr(0, 1) == '/' ? baseURL + item.imgurl : item.imgurl)
				})
				this.pros_data = res.data.pros_data //属性结构
				this.remain_score = res.data.remain_score,
					this.isloading = false
				this.detail.nodes1 = res.data.data.description.replace(/\<img/gi,
					'<img style="max-width:100%;height:auto;display:block;"') //富文本详情
				this.detail.nodes2 = res.data.data.specifications.replace(/\<img/gi,
					'<img style="max-width:100%;height:auto;display:block;"') //富文本规格
				this.detail.nodes3 = res.data.data.customer_service.replace(/\<img/gi,
					'<img style="max-width:100%;height:auto;display:block;"') //富文本参数
			})
			//活动
			getProductOpenLabel({
				user_id: this.userInfo.id,
				pid: options.pid,
			}).then(res => {
				if (res.data.code == 0) {
					//兼容ios時間的封裝
					function strToDate(dateObj) {
						dateObj = dateObj.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/')
						dateObj = dateObj.slice(0, dateObj.indexOf("."))
						return new Date(dateObj)
					}
					if (res.data.data.issnapup == 1) { //抢购
						let t = strToDate(res.data.data.buystart_time).getTime().toString().substring(0, 10)
						let e = strToDate(res.data.data.countdown_time).getTime().toString().substring(0, 10)
						this.setTimea(t, e)
						console.log(this.robTime)
					}
					if (res.data.data.islimit == 1) { //限购
						this.limitData.limit_days = res.data.data.limit_days
						this.limitData.limit_num = res.data.data.limit_num
					}
					this.is_virtual.is_virtual_shop = res.data.data.is_virtual
					this.is_privilege = res.data.data.is_privilege
					this.issnapup = res.data.data.issnapup
					this.islimit = res.data.data.islimit,
						this.pay_type = res.data.data.pay_type, //产品专属支付方式
						this.extend_money = res.data.data.extend_money, // 首次推广奖励
						this.is_integral_product = res.data.data.is_integral_product //积分产品
					this.parent_id = res.data.data.parent_id
					this.is_open_evaluation = res.data.data.is_open_evaluation
				}
			})
			//满送活动
			fullpresent({
				user_id: this.userInfo.id,
				product_id: options.pid
			}).then(res => {
				if (res.data.code == 0) {
					this.activity = true
				}
				this.message = res.data.message
			})
			//满减活动
			fullCut({
				user_id: this.userInfo.id,
				product_id: options.pid
			}).then(res => {
				if (res.data.code == 0) {
					this.activity2 = true
				}
				this.message2 = res.data.message
			})
			//优惠券
			coupon({
				user_id: this.userInfo.id,
				product_id: options.pid
			}).then(res => {
				if (res.data.code == 0) {
					this.ofCoupon = true
					var coupon = [];
					for (var idx in res.data.message) {
						var message = res.data.message[idx]
						var temp = {
							user_scene: message.user_scene,
							NeedMoney: message.NeedMoney,
							coupon_id: message.coupon_id,
							nowtime: message.nowtime,
							endtime: message.endtime,
							user_scene: message.user_scene,
							MaxMoney: message.MaxMoney,
							remark: message.remark
						}
						coupon.push(temp)
					}

					this.coupon = coupon
				}
			})
			// 产品评论
			product_evaluations({
				user_id: this.userInfo.id,
				product_id: options.pid,
				num: 1,
				pagea: 1
			}).then(res => {
				if (res.data.length == 0) {
					return
				}

				this.evaluate = res.data[0] ? res.data[0] : ''
			})
		},
		methods: {
			//t 开始时间  e 结束时间 
			setTimea: function(t, e) {
				var totalSecond = t - Date.parse(new Date()) / 1000;
				var endSecond = e - Date.parse(new Date()) / 1000;
				if (totalSecond > 0) { //
					var title = '距开抢仅剩:'
					var status = 0;
				}
				if (totalSecond < 0 && endSecond > 0) {
					var title = '距结束仅剩:'
					totalSecond = endSecond
					var status = 1;
				}
				var interval = setInterval(function() {
					// 秒数  
					var second = totalSecond;
					// 天数位  
					var day = Math.floor(second / 3600 / 24);
					var dayStr = day.toString();
					if (dayStr.length == 1) dayStr = '0' + dayStr;
					// 小时位  
					var hr = Math.floor((second - day * 3600 * 24) / 3600);
					var hrStr = hr.toString();
					if (hrStr.length == 1) hrStr = '0' + hrStr;
					// 分钟位  
					var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
					var minStr = min.toString();
					if (minStr.length == 1) minStr = '0' + minStr;

					// 秒位  
					var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
					var secStr = sec.toString();
					if (secStr.length == 1) secStr = '0' + secStr;
					this.robTime.countDownDay = dayStr
					this.robTime.countDownHour = hrStr
					this.robTime.countDownMinute = minStr
					this.robTime.countDownSecond = secStr
					this.robTime.title = title
					this.robTime.status = status
					totalSecond--;
					if (endSecond < 0) {
						clearInterval(interval);
						this.robTime.title = '抢购活动已结束'
						this.robTime.countDownDay = '00'
						this.robTime.countDownHour = '00'
						this.robTime.countDownMinute = '00'
						this.robTime.countDownSecond = '00'
						this.robTime.status = 0
					}
				}.bind(this), 1000);
			},
			//优惠券弹框
			actionSheetChange() {
				this.actionSheetHidden = !this.actionSheetHidden
			},
			//打开关闭底部弹框
			onTaptankuang() {
				this.showtankuang = true
				// this.createNewImg()
			},
			//商品属性显示隐藏
			showProductProperty() {
				this.hidden_property = !this.hidden_property
				console.log(this.hidden_property)
			},
			//数量减一
			sub() {
				if (this.buy_count > 1) {
					this.buy_count = --this.buy_count
				}
			},

			//数量加一
			add() {
				if (this.buy_count == this.current_product.storenum) {
					uni.showModal({
						title: "提示",
						content: '库存不足',
						showCancel: false
					})
					return;
				}
				this.buy_count = ++this.buy_count
			},
			inputBuycount(e) {
				console.log(e)
				this.buy_count = e.detail.value
			},
			//选择商品属性
			radioChange(e, index) {
				console.log(e, index)
				this.pros_data[index].act = true
				let array_list = this.pros_data
				array_list[index].list_u = e.detail.value
				console.log(array_list)
				let pros_arry = []
				for (const item of array_list) {
					pros_arry.push(item.list_u)
				}
				this.pros_arry = pros_arry
				var str = pros_arry.join('-')
				console.log(str)
				this.str = str
				var _current_product = {}
				for (var i = 0; i < this.product.product_prices.length; i++) {
					if (str == this.product.product_prices[i].prope) {
						_current_product.now_price = this.product.product_prices[i].now_price.toFixed(2);
						_current_product.orgin_price = this.product.product_prices[i].orgin_price.toFixed(2);
						_current_product.id = this.product.product_prices[i].id;
						_current_product.storenum = this.product.product_prices[i].storenum;
						_current_product.need_score = this.current_product.need_score;
						_current_product.sell_count = this.current_product.sell_count;
						_current_product.show_sell_count = this.current_product.show_sell_count
						this.current_product = _current_product
						//获取会员产品价格
						var sendData = {
							product_id: this.product_id,
							prod_id: this.product.product_prices[i].id
						}
						MemberPrice(sendData).then(res => {
							if (res.data.code == 0) {
								this.current_product.now_price = res.data.data.memberPrice
							}
						})
						break;
					}
				}
			},
			showProductDetail(e) { //富文本框切换
				this.currentDetail = e
			},
			collect() {
				if (this.product.data.collect) {
					this.product.data.collect = 0
				} else {
					this.product.data.collect = 1
				}
				check_collect({
					user_id: this.userInfo.id,
					product_id: this.product.data.id,
					is_collet: this.product.data.collect
				}).then(res => {
					uni.showToast({
						title: res.data.msg
					})
				})

			},
			//加购物车
			addCarts() {
				if (this.dianpuleibie == 5) {
					if (this.pay_type == 1) {
						uni.showModal({
							title: "提示",
							content: '该产品是有指定的支付方式,不能加入购物车,只能单独购买',
							showCancel: false
						})

					}
				}
				if (this.buy_count > this.current_product.storenum) {
					uni.showModal({
						title: "提示",
						content: '库存不足',
						showCancel: false
					})

					return;
				}
				//判断是否有属性
				var pros_data_length = this.pros_data.length; //分类的长度
				var pros_arry_length = this.pros_arry.length; //选择的长度  被选中的属性
				var need_score = '0'
				console.log(this.pros_data)
				for (const item of this.pros_data) {
					if (!item.act) {
						uni.showModal({
							title: '请选择',
							content: '请选择' + item.name,
							showCancel: false
						})
						return;
					}
				}
				//没有属性的产品
				if (this.current_product.need_score && this.pros_data.length == 0) { //是否需要积分
					need_score = this.current_product.need_score //需要的积分
				}
				// 把当前页面产品的数据给购物车页面
				let product = this.product;
				let property_id = '';
				let str = this.pros_arry.join("-")
				let remain_score = this.remain_score //用户的积分
				let buy_count = this.buy_count //购买的数量
				this.product.product_prices.forEach((item, index) => {
					if (item.prope == str) {
						property_id = item.id;
						need_score = item.need_score //一个产品需要的积分
					}
				})
				let data = {
					is_virtual_shop: this.is_virtual.is_virtual_shop,
					pid: product.data.id,
					pname: product.data.name, // 商品名字
					prope: str,
					property_id: "",
					rcount: this.buy_count, // 购买数量 
					totalprice: this.buy_count * this.current_product.now_price, // 总价格
					need_score: need_score, //需要的积分
					remain_score: remain_score, //用户积分
					default_imgurl: product.data.default_imgurl, // 产品图片
					remarks: product.data.remarks,
					now_price: this.current_product.now_price, // 当前价格
					status: true,
					extend_money: this.extend_money
				}
				//选中产品属性匹配  有选中的值返回匹配值的下标没有返回空
				var _this = this

				function pipei() {
					let index = '';
					let str = _this.str;
					let product = _this.product.product_prices;
					for (let i = 0; i < product.length; i++) {
						if (product[i].prope == str) {
							return i;
						}
					}
					return index;
				}
				let index = pipei()
				if (index != '') {
					data.property_id = product.product_prices[index].id;
					data.totalprice = this.buy_count * parseFloat(product.product_prices[index].now_price);
					data.prope = product.product_prices[index].prope;
				}
				var cart = uni.getStorageSync(this.dianpuleibie + 'shopping-cart');
				if (!cart) {
					cart = [data]
					uni.setStorageSync(this.dianpuleibie + 'shopping-cart', cart);
					uni.showToast({
						title: '加入购物车成功'
					})
				} else {
					//重复产品数量加一
					for (var i = 0; i < cart.length; i++) {
						if (data.pid == cart[i].pid && data.property_id == cart[i].property_id) {
							cart[i].rcount += data.rcount;
							uni.setStorageSync(this.dianpuleibie + 'shopping-cart', cart);
							uni.showToast({
								title: '加入购物车成功'
							})
							return
						}
					}

					cart.push(data);
					uni.setStorageSync(this.dianpuleibie + 'shopping-cart', cart);
					uni.showToast({
						title: '加入购物车成功'
					})
				}

			},
			linktoCart() {
				uni.reLaunch({
					url: '/pages/index/index?current_page=' + 'cart'
				})
			},
			// 跳转到更多评论的页面
			gotoEvaluate() {
				uni.navigateTo({
					url: '/pages/evaluate/evaluate?id=' + this.product.data.id,
				})
			},
			//打开关闭底部弹框
			bottomtankuang() {
				this.showtankuang = true
				// this.createNewImg()
			},
			bottomClose() {
				this.showtankuang = false
			},
			//领取优惠券视图容器

			onCoupon(e) {
				getCoupon({
					coupon_id: e
				}).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: res.message,
							icon: 'success'
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: 'loading'
						})
					}
				})
			},
			//跳转到结算中心
			buy(e) {
				var _this = this
				if (this.dianpuleibie == 5) {
					var productid = e //拼团
					var need_score_p = 0; //总需要积分
					var need_score = 0; //总需要积分
					for (const item of this.pros_data) {
						if (!item.act) {
							uni.showModal({
								title: '请选择',
								content: '请选择' + item.name,
								showCancel: false
							})
							return;
						}
					}
					//没有属性的产品
					if (this.current_product.need_score && this.pros_data.length == 0) { //是否需要积分
						need_score_p = this.current_product.need_score * this.buy_count //需要的积分
						need_score = this.current_product.need_score
						if (need_score_p > this.remain_score) {
							uni.showModal({
								title: '提示',
								content: "您的会员积分不够",
								showCancel: false
							})
							return;
						}
					}
					if (this.parent_id<0) {
						uni.showModal({
							title: '提示',
							content: "您没有推荐人不能购买",
							showCancel: false
						})
						return;
					}

					if ((this.group == 1 || this.group == 2) && productid) { //拼团
						if (this.buy_count > this.groupInfo.stock) {
							uni.showModal({
								title: '提示',
								content: "库存不足",
								showCancel: false
							})
							return;
						}
					} else {
						if (this.buy_count > this.current_product.storenum) {
							uni.showModal({
								title: '提示',
								content: '库存不足',
								showCancel: false
							})
							return;
						}
					}
					var product = this.product;
					if ((this.group == 1 || this.group == 2) && productid) { //拼团
						var now_price = this.groupInfo.price;
					} else {
						var now_price = this.current_product.now_price; // product.data.now_price
					}
					var propeName = this.pros_arry.join("-");
					var property_id = "";
					var remain_score = this.remain_score //用户的积分
					var buy_count = this.buy_count //购买的数量
					this.product.product_prices.forEach((item, index) => {
						if (item['prope'] == propeName) {
							property_id = item.id;
							need_score_p = item.need_score * buy_count; //需要的积分
							need_score = item.need_score
						}
					})
					if (need_score_p > remain_score) {
						app.showModal("您的会员积分不够！");
						uni.showModal({
							title: '提示',
							content: '您的会员积分不够',
							showCancel: false
						})
						return;
					}
					var data = {
						pid: product.data.id,
						pname: product.data.name,
						property_id: property_id,
						rcount: this.buy_count,
						totalprice: this.buy_count * now_price,
						need_score: need_score,
						default_imgurl: product.data.default_imgurl,
						remarks: product.data.remarks,
						now_price: now_price, //this.data.current_product.now_price,
						decrease_money: '',
						supply_id: product.data.supply_id,
						prope: propeName,
						is_virtual_shop: this.is_virtual.is_virtual_shop,
						extend_money: this.extend_money,
					}
					var cart = [data];
					console.log(cart)
					if ((this.group == 1 || this.group == 2) && productid) {
						var activitie_id = this.groupInfo.activitie_id
						var sendData = {
							pid: productid,
							num: this.buy_count,
							activitie_id: activitie_id,
							group_id: this.group_id,
						}
						checkCollage(sendData).then(res => {
							if (res.code != 0) {
								wx.showModal({
									title: '提示',
									content: res.message,
									showCancel: false
								})
								return;
							} else {
								if (_this.data.group_id) {
									uni.navigateTo({
										url: '/pages/create-order/create-order?cart=' + JSON.stringify(cart) + '&couponKeyid=' + '0' +
											'&couponMoney=' + '0' +
											'&couponNeedMoney=' + '0' + '&grouptype=' + _this.group + '&productid=' + productid +
											'&activitie_id=' + activitie_id + '&group_id=' + _this.group_id + '&productType=' + _this.groupInfo
											.type + '&pay_type=' + _this.pay_type + '&renew_id=' + _this.renew_id,
									})
								} else {
									uni.navigateTo({
										url: '/pages/create-order/create-order?cart=' + JSON.stringify(cart) + '&couponKeyid=' + '0' +
											'&couponMoney=' + '0' +
											'&couponNeedMoney=' + '0' + '&grouptype=' + _this.group + '&productid=' + productid +
											'&activitie_id=' + activitie_id + '&productType=' + _this.groupInfo.type + '&pay_type=' + _this
											.pay_type + '&renew_id=' + _this.renew_id,
									})
								}
							}
						})
					} else {
						this.$gotoLogin().then(res => {
							if (res) {
								uni.navigateTo({
									url: '/pages/create-order/create-order?cart=' + JSON.stringify(cart) + '&couponKeyid=' + '0' +
										'&couponMoney=' +
										'0' +
										'&couponNeedMoney=' + '0' + '&pay_type=' + _this.pay_type + '&renew_id=' + _this.renew_id,
								})
							}
						})
					}
				}
			}
		},
		computed: {
			...mapState([
				'dianpuleibie',
				'userInfo'
			])
		}
	}
</script>

<style scoped>
	/* 加载动画 */
	.xianshi {
		max-width: 10% !important;
	}

	.loading-content {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 220upx;
	}

	.loading-content .loader2 {
		width: 40upx;
		height: 40upx;
		display: inline-block;
		padding: 0px;
		border-radius: 100%;
		border: 8upx solid;
		border-top-color: #888;
		border-bottom-color: rgba(0, 0, 0, 0.1);
		border-left-color: #888;
		border-right-color: rgba(0, 0, 0, 0.1);
		-webkit-animation: loader2 1s ease-in-out infinite;
		animation: loader2 1s ease-in-out infinite;
	}

	.loading-content .loading-tips {
		margin-left: 10upx;
		color: #777;
	}

	@keyframes loader2 {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	/* 加载动画end */
	.product-name {
		padding: 0 20upx;
		line-height: 45upx;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		background-color: #fff;
	}

	.price {
		padding: 0 20upx 20upx 20upx;
		background-color: #fff;
		display: flex;
		align-items: center;
		margin-bottom: 30upx;
	}

	.price .now-price {
		font-size: 30upx;
		color: #c33;
	}

	.price .fenxiang {
		display: flex;
		align-items: center;
		position: absolute;
		right: 60upx;
		font-size: 26upx;
		color: #999;
	}

	.price .fenxiang image {
		width: 50upx;
		height: 50upx;
	}

	.price .origal-price {
		color: #bbb;
		font-size: 26upx;
		text-decoration: line-through;
		margin-left: 10upx;
	}

	.price .right {
		padding-top: 60upx;
		margin-left: 50upx;
		color: #bbb;
		font-size: 26upx;
		width: 130upx;
	}

	.card {
		text-align: center;
		line-height: 100upx;
	}

	.shop-title {
		padding: 25upx 20upx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 15px;
	}

	.activity {
		background-color: #fff;
		padding: 25upx 20upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 22upx;
		border-bottom: 1px solid #f6f6f6;
	}

	.activity .activity-item text {
		padding: 1px 4px;
		border: 1px solid #c30;
		color: #fff;
		border-radius: 3px;
		margin-right: 15px;
	}

	.activity1 .activity-item text {
		border-color: #c30;
		background-color: #c30;
	}

	.activity2 .activity-item text {
		border-color: #f93;
		background-color: #f93;
	}

	.activity2 .activity-item text:nth-child(1) {
		background-color: #fff;
		color: #f93;
	}

	.select-product {
		margin-top: 15px;
		background-color: #fff;
		padding: 25upx 20upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.select-product .left text {
		margin-left: 20upx;
	}

	.arrows-right {
		width: 30upx;
		height: 30upx;
	}

	.arrows-right.active {
		transform: rotate(270deg);
	}

	.cont {
		margin: 30upx 30upx;
	}

	.neirong {
		margin-bottom: 30upx;
	}


	.container {
		height: 100%;
		display: flex;
		margin-bottom: 12px;
		width: 100%;
	}

	.container .mingcheng {
		display: flex;
		align-items: center;
		color: #666;
		font-size: 28upx;
	}

	.container .radio {
		display: block;
		text-align: center;
		line-height: 28upx;
		margin-bottom: 5upx;
		margin-left: 20upx;
		margin-top: 20upx;
		padding: 0px 10px 10px 10px;
	}

	.product-property .product-count {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		margin: 15upx 0 0 20upx;
	}

	.product-property .product-count .list-cont {
		height: 60upx;
		line-height: 60upx;
		margin-left: 20upx;
		display: flex;
		border: 1px solid #ddd;
		border-radius: 3px;
	}

	.product-property .product-count .list-cont text {
		width: 60upx;
		text-align: center;
		font-weight: bold;
		font-size: 38upx;
	}

	.product-property .product-count .list-cont input {
		height: 60upx;
		line-height: 60upx;
		width: 80upx;
		text-align: center;
		font-size: 30upx;
		border-right: 1px solid #ddd;
		border-left: 1px solid #ddd;
	}

	.product-evaluate {
		padding: 0 20upx;
		background-color: #fff;
		margin-top: 15px;
		clear: both;
	}

	.product-evaluate .evaluate-title {
		padding: 25upx 0;
		display: flex;
		justify-content: space-between;
	}

	.product-evaluate .evaluate-title view text {
		color: #c33;
	}

	.product-evaluate .evaluate-cont {
		padding: 20upx 0;
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
	}

	.product-evaluate .evaluate-cont .evaluate-name {
		display: flex;
		align-items: center;
	}

	.product-evaluate .evaluate-cont .evaluate-name .name {
		margin-right: 15upx;
		font-size: 26upx;
	}

	.product-evaluate .evaluate-cont .evaluate-detail {
		margin-top: 20upx;
		line-height: 40upx;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		background-color: #fff;
	}

	.product-evaluate .evaluate-cont .evaluate-img {
		display: flex;
		flex-wrap: wrap;
		margin-top: 10upx;
	}

	.product-evaluate .evaluate-cont .evaluate-img .img {
		width: 150upx;
		height: 150upx;
		margin-right: 15upx;
		margin-bottom: 15upx;
		background-color: #eee;
	}

	.product-evaluate .evaluate-cont .evaluate-time {
		color: #aaa;
		margin-top: 10upx;
		display: flex;
		flex-wrap: wrap;
		font-size: 26upx;
	}

	.product-evaluate .evaluate-cont .evaluate-time text {
		margin: 0 4px;
	}

	.product-evaluate .evaluate-cont .evaluate-time text:nth-child(1) {
		margin-left: 0;
	}

	.product-evaluate .evaluate-bottom {
		padding: 20upx 0;
		font-size: 28upx;
		display: flex;
		justify-content: space-between;
		color: #aaa;
	}

	.product-evaluate .evaluate-bottom .right {
		display: flex;
		align-items: center;
	}

	.product-detail {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 25upx 20upx;
		margin-top: 15px;
		background-color: #fff;
		clear: both;
	}

	.bottom-btn,
	.bottom-btn2 {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100upx;
		display: flex;
		background-color: #fff;
		z-index: 99;
	}

	.bottom-btn>view,
	.bottom-btn2>view {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bottom-btn .shopping-cart,
	.bottom-btn2 .shopping-cart {
		width: 120upx;
		height: 100%;
		flex-direction: column;
		border-top: 1px solid #eee;
		box-sizing: border-box;
	}

	.bottom-btn .shopping-cart .img,
	.bottom-btn2 .shopping-cart .img {
		width: 50upx;
		height: 50upx;
	}

	.bottom-btn .shopping-cart text,
	.bottom-btn2 .shopping-cart text {
		color: #555;
		font-size: 22upx;
		margin-top: 2px;
	}

	.bottom-btn .add-cart {
		width: 320upx;
		height: 100%;
		background-color: #f93;
		color: #fff;
	}

	.bottom-btn .bug-now {
		width: 320upx;
		height: 100%;
		background-color: #cf3333;
		color: #fff;
	}

	.bottom-btn .bug-now1 {
		width: 320upx;
		height: 100%;
		background-color: #a8a8a8;
		color: #fff;
	}

	.bottom-btn2 .add-cart {
		width: 260upx;
		height: 100%;
		background-color: #f93;
		color: #fff;
		text-align: center;
	}

	.wxcard {
		text-align: center;
		line-height: 50px;
		width: 100%;
	}

	.bottom-btn2 .add_card {
		width: 100%;
		height: 100%;
		background-color: #f93;
		color: #fff;
		text-align: center;
	}

	.bottom-btn2 .add-cart1 {
		width: 260upx;
		height: 100%;
		background-color: #a52a2a;
		color: #fff;
	}

	.bottom-btn2 .bug-now {
		width: 260upx;
		height: 100%;
		background-color: #cf3333;
		color: #fff;
	}

	.bottom-btn2 .bug-now1 {
		width: 260upx;
		height: 100%;
		background-color: #a8a8a8;
		color: #fff;
	}

	.bottom-btn2>view:nth-child(1) {
		border-right: 1px solid #eee;
	}

	.action_sheet {
		position: fixed;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		width: 100%;
		height: 100%;
		z-index: 100;
	}

	.activity-card {
		background-color: #fff;
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 850upx;
		z-index: 101;
	}

	.activity-card scroll-view {
		width: 100%;
		height: 740upx;
		overflow: hidden;
	}

	.activity-card .btn {
		width: 670upx;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		background-color: #c30;
		color: #fff;
		border-radius: 40upx;
		margin: 0 auto;
		margin-top: 15upx;
	}

	.activity-card .title {
		height: 90upx;
		font-size: 34upx;
		line-height: 90upx;
		text-align: center;
		color: #555;
	}

	/* 购物券 */

	.Coupon-item {
		margin: 0 auto;
		width: 660upx;
		height: 220upx;
		/* padding: 0 10upx; */
		margin-bottom: 40upx;
		position: relative;
		background-color: #ea9b80;
		display: flex;
	}

	.Coupon-item .par {
		width: 410upx;
		height: 180upx;
		padding: 20upx;
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.Coupon-item .beizhu {
		font-size: 26upx;
		color: #fff;
		display: flex;
		align-items: center;
	}

	.Coupon-item .par .sub:nth-child(1) {
		font-size: 60upx;
	}

	.Coupon-item .par .sub:nth-child(2) text {
		font-size: 26upx;
	}

	.Coupon-item .par .sub:nth-child(3) {
		font-size: 22upx;
		line-height: 25upx;
	}

	.Coupon-item .copy {
		width: 170upx;
		height: 180upx;
		padding: 25upx;
		display: flex;
		align-items: center;
		/* justify-content: center; */
		position: relative;
	}

	.Coupon-item .copy::before {
		content: '';
		height: 160upx;
		position: absolute;
		left: 0;
		top: 30upx;
		border-left: 1px dashed #fff;
	}

	.Coupon-item .copy view {
		color: #fff;
		font-size: 30upx;
		width: 120upx;
		padding: 10upx;
		text-align: center;
	}

	.Coupon-item .round {
		display: block;
		width: 40upx;
		height: 40upx;
		background-color: #fff;
		border-radius: 50%;
		position: absolute;
		z-index: 102;
	}

	.Coupon-item .round1 {
		top: -20upx;
		left: -20upx;
	}

	.Coupon-item .round2 {
		top: -20upx;
		right: -20upx;
	}

	.Coupon-item .round3 {
		bottom: -20upx;
		left: -20upx;
	}

	.Coupon-item .round4 {
		bottom: -20upx;
		right: -20upx;
	}

	.Coupon-item .round5 {
		top: -20upx;
		right: 190upx;
	}

	.Coupon-item .round6 {
		bottom: -20upx;
		right: 190upx;
	}

	.groupTime {
		background: rgb(2, 179, 0);
		height: 25px;
		text-align: center;
		font-size: 18px;
	}

	.collageTag {
		font-size: 12px;
		padding: 1px 3px;
		vertical-align: text-top;
		border: 1px #fc8b19 solid;
		color: #fc8b19;
		margin-right: 10px;
		position: absolute;
		right: 0;
		margin-top: 5px;
	}

	.gr {
		width: 100%;
		border-top: 1px solid #d1d1d1;
		display: block;
		/* border-bottom: 1px solid #d1d1d1; */
		background: #fff;
	}

	.group-product {
		width: 100%;
		padding: 20upx 0;
		font-size: 35upx;
		display: flex;
		justify-content: space-between;
		padding-left: 5px;
	}

	.group-product-head {
		width: 100%;
		padding-right: 5px;
	}

	.group-con {
		width: 100%;
		float: left;
		margin-top: 10px;
	}

	.group-con-img {
		margin-left: 20px;
		margin-bottom: 10px;
		width: 75px;
		float: left;
	}

	.group-con-img image {
		width: 60px;
		height: 60px;
		border-radius: 30px;
	}

	.groupsName {
		width: 110px;
		float: left;
	}

	.top {
		float: left;
	}

	.groupsName button {
		width: 75px;
		height: 30px;
	}

	.islimit {
		width: 100px;
		height: 20px;
		background: #f93;
		display: block;
		font-size: 28upx;
		color: #fff;
		text-align: center;
		border-radius: 6px;
		line-height: 22px;
		overflow: hidden;
	}

	/* 底部弹框 */

	.tankuang {
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 103;
		position: absolute;
		right: 0;
		bottom: 0;
	}

	.tankuang .container1 {
		background-color: #eee;
		height: 35%;
		width: 100%;
		position: fixed;
		right: 0;
		bottom: 0;
		animation: fenxiang 0.4s;
		overflow: hidden;
	}

	@keyframes fenxiang {
		from {
			height: 0%;
		}

		to {
			height: 35%;
		}
	}

	.tankuang .container1 .share {
		height: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.tankuang .container1 .share .btn {
		font-size: 28upx;
		height: 200upx;
		width: 330upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: rgba(0, 0, 0, 0);
	}

	.tankuang .container1 .share .btn::after {
		border: none;
	}

	.tankuang .container1 .share image {
		width: 100upx;
		height: 100upx;
	}

	.tankuang .container1 .close {
		background-color: #fff;
		height: 100upx;
		width: 100%;
		line-height: 100upx;
		text-align: center;
		position: fixed;
		bottom: 0;
	}

	.active2 {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
	}

	.tankuang2 {
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 104;
		position: fixed;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tankuang2 .container1 {
		height: 90%;
		width: 90%;
		background-color: #FFF;

	}

	.Detailactive2 {
		padding: 10upx 20upx;
		position: relative;
		z-index: 9;
		color: #333;
	}

	.Detailactive2::after {
		position: absolute;
		content: '';
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background: red;
		z-index: -1;
		transform: scaleX(0);
		transition: all .2s linear;
	}

	.Detailactive {
		color: white;
	}

	.Detailactive::after {
		transform: scaleX(1);
	}

	.empty {
		width: 100%;
		height: 150upx;
	}
</style>
