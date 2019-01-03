<template>
	<view class="main">
		<uni-drawer class="draw" :visible="rightDrawerVisible" mode="right" @close="ToggleDrawer">
			<view>
				<view class="uni-card">
					<view class="uni-list">
						<block v-for="(list,index) in lists" :key="index">
							<view class="uni-list-cell uni-collapse">
								<view class="uni-list-cell-navigate uni-navigate-bottom" :class="list.show ? 'uni-active' : ''" @click="trigerCollapse(index)">
									{{list.title}}
								</view>
								<view class="uni-collapse-content" :class="list.show ? 'uni-active' : ''">
									<view v-if="list.type === 'list'">
										<view class="uni-list">
											<view @click="selectCate(item, idx)" :class="['uni-list-cell', {act: currentCate === idx}]" hover-class="none" v-for="(item, idx) in list.list" :key="idx">
												<view class="uni-list-cell-navigate uni-navigate-right">{{ item.name }}</view>
											</view>
										</view>
									</view>
									<view v-if="list.type === 'price'">
										<view class="uni-list">
											<view @click="selectPrice(item, idx)" :class="{act: currentPrice === idx}" class="uni-list-cell" hover-class="none" v-for="(item, idx) in list.list" :key="idx">
												<view class="uni-list-cell-navigate uni-navigate-right">&yen;{{ item.min }} - &yen;{{ item.max }}</view>
											</view>
										</view>
										<view class="divPrice">
											<view><input v-model="params.min" type="text" /></view>
											<view>——</view>
											<view><input v-model="params.max" type="text"/></view>
										</view>
									</view>
								</view>
							</view>
						</block>
					</view>
				</view>
				<view class="btn"><button @click="serachCate" type="warn" size="mini">确认</button></view>
			</view>
		</uni-drawer>	
		<view class="searchList">
			<view class="top">
				<view class="search">
					<input type="text" class="key" v-model="params.search"><view :class="['btn', {act: params.search}]" @click="searchData"><text>搜索</text></view>
				</view>
				<view class="tabs">
					<view v-for="(item, index) in tabs" :key="index" :class="{ act: currentTab === index + 1 }" @click="changeTab(item)">
						<text :class="{ up: index === 3 && params.order === 3, down: index === 3 && params.order === 4 }">{{ item.name }}</text>
					</view>
				</view>
			</view>
			<view class="list">
				<block v-if="productList.length">
					<scroll-view scroll-y class="product" @scrolltolower="loadMove">
						<view class="uni-product-list">
							<view class="uni-product" v-for="(product,index) in productList" :key="index">
								<navigator hover-class="none" class="image-view"  :url="'/pages/product_detail/product_detail?pid='+product.id">
									<image v-if="renderImage" class="uni-product-image" :src="product.default_imgurl"></image>
								</navigator>
								<view class="uni-product-title">{{product.name}}</view>
								<view class="uni-product-price">
									<text class="uni-product-price-favour">￥{{product.orgin_price}}</text>
									<text class="uni-product-price-original">￥{{product.now_price}}</text>
									<view class="comment">
										<text>{{ product.tol_level }}条评价</text>
										<text>{{ product.ratio }}好评</text>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</block>
				<empty-data v-if="noData && !productList.length">
					没有发现相关产品
				</empty-data>
			</view>
		</view>
	</view>
</template>

<script>
	import uniDrawer from '@/components/uni-drawer'
	import { searchList, getClassifyList } from '@/common/api'
	import { mapState } from 'vuex'
	export default {
		name: 'productList',
		components: { uniDrawer },
		onLoad(opt) {
			if (opt.keyword) this.params.search = opt.keyword
			if (opt.typeid) this.params.type_id = opt.typeid
			this.params.user_id = this.userInfo.id
			this.loadData()
			this.getGroup()
			setTimeout(()=> {
				this.renderImage = true;
			}, 300)
		},
		data () {
			return {
				noData: false,
				load: true,
				currentTab: 1,
				currentCate: '',
				currentPrice: '',
				tabs: [
					{ name: '全部', type: 1 },
					{ name: '筛选', type: 2 },
					{ name: '销量', type: 3 },
					{ name: '价格', type: 4 }
				],
				rightDrawerVisible: false,
                lists: [
                    {
                        title: "分类",
                        type: 'list',
                        show: false,
						list: []
                    },
					{
						title: '价格',
						type: 'price',
						show: false,
						list: [
							{min:0 ,max: 100 },
							{min:100 ,max: 200 },
							{min:200 ,max: 300 },
							{min:300 ,max: 400 },
							{min:400 ,max: 500 }
						]
					}
                ],
				productList: [],
				renderImage: false,
				params: {
					pages: 1,
					order:1,
					search: '',
					type_id: '',
					min: '',
					max:'',
					user_id: ''
				}
			}
		},
		methods: {
			searchData () {
				this.productList = []
				this.load = true
				this.params.min = ''
				this.params.max = ''
				this.params.type_id = ''
				this.params.pages = 1
				this.loadData()
			},
			selectCate(item, idx) {
				this.currentCate = idx
				this.params.type_id = item.id
			},
			selectPrice(item,idx) {
				this.currentPrice = idx
				this.params.min = item.min
				this.params.max = item.max
			},
			ToggleDrawer() {
				this.rightDrawerVisible = !this.rightDrawerVisible
			},
			changeTab(item) {
				this.load = true
				this.params.pages = 1
				this.currentTab = item.type
			    if (item.type === 1) {
					this.params.order = 1
				} else if (item.type === 2) {
					this.params.order = 4
					this.ToggleDrawer()
				} else if (item.type === 3)  {
					this.params.order = 2
				} else {
					this.params.order === 4 ? this.params.order = 3 : this.params.order = 4
				}
				if (item.type !== 2) {
					this.productList = []
					this.loadData()
				}
			},
			trigerCollapse(e) {
				for (let i = 0, len = this.lists.length; i < len; ++i) {
					if (e === i) {
						this.lists[i].show = !this.lists[i].show;
					} else {
						this.lists[i].show = false;
					}
				}
			},
			loadMove () {
				this.params.pages++
				this.loadData();
			},
			getGroup () {
				getClassifyList({ ticket:this.userInfo.ticket || '', uname: this.userInfo.uname || ''}).then(res => {
					this.lists[0].list = res.data.data
				})
			},
			serachCate () {
				this.params.pages = 1
				this.productList = []
				this.loadData()
				this.rightDrawerVisible = false
			},
			loadData(action = 'add') {
				if (this.load) {
					uni.showLoading()
					this.noData = false
					searchList(this.params).then(res => {
						uni.hideLoading()
						if (res.data.length) {
							if (action === 'refresh') {
								this.productList = [];
							}
							this.productList = [...this.productList, ...res.data]
						} else {
							this.load = false
							uni.showToast({
								icon: 'none',
								title: '没有更多产品了>_<'
							})
						}
						if (!this.productList.length) this.noData = true
					})
				}
			}			
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
	}
</script>

<style lang="less">
uni-page-body, page, .searchList,.main { height: calc(100%);overflow: hidden;}		
.searchList {
	display: flex;
	flex-direction: column;
	flex-flow: column;
	.top {
		//overflow: hidden;
		.search {
			display: flex;
			height: 70upx;
			align-items: center;
			margin: 8px 15px;
			box-sizing: border-box;
			background-color:white;
			border-radius: 40upx;
			overflow: hidden;
			.key {
				flex: 1;
				height: 100%;
				padding: 0 15upx;
			}
			.btn {
				width: 80upx;
				padding: 0 15upx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 26upx;
				color:white;
				height: 100%;
				background:#F44336;
			}
		}
		.tabs {
			display: flex;
			height: 80upx;
			align-items: center;
			position: relative;
			&::after {
				top: 0;
			}
			&::before {
				bottom: 0
			}
			&::after,&::before {
				position: absolute;
				content:'';
				left: 0;
				width: 100%;
				border:1px solid #eee;
				transform: scaleY(.5);
			}
			& > view {
				flex: 1;
				font-size: 26upx;
				justify-content: center;
				display: flex;
				align-items: center;
				position: relative;
				height: 100%;
				&:last-of-type {
					& > text {
						display: block;
						position: relative;
						&::after, &::before {
							position: absolute;
							content:'';
							width:0; 
							height:0; 
							right: -12px;
							border-left:4px solid transparent;
							border-right:4px solid transparent;
							border-bottom:7px solid #b1b1b1
						} 
						&::after {
							top: -2upx;
						}
						&::before {
							bottom: -2upx;
							right: -13px;
							transform: rotate(60deg);
						}
					}
				}
				&::after{
					content: '';
					position: absolute;
					border-top:1px solid #F44336;
				    transform: scaleX(0);
					left:0;
					bottom: 0;
					width: 100%;
					transition: all .2s;
				}
				&.act {
					color: #F44336;
					&::after {
						transform: scaleX(.6);
					}
					.down {
						&:before {
							border-bottom-color:#F44336;
						}
					}
					.up {
						&:after {
							border-bottom-color: #F44336;
						}
					}
				}
			}
		}
	}
	.list {
		overflow: hidden;
		position: relative;
		flex: 1;
		.product {
			height: 100%;
			.comment {
				font-size: 24upx;
				color:#8c8c8c
			}
		}
	}
}	
.draw {
	.uni-card {
		margin: 0;
		box-shadow: none;
	}
}
</style>