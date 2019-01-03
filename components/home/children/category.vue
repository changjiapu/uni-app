<template>
	<view>
		<!-- 分类导航组件 -->
		<swiper class='category-nav' indicator-color="#eee" indicator-active-color="#0099FF" :indicator-dots="data.img_list.length > 2 * data.column"
		:style="{ height:data.img_list.length <= data.column ? '150upx' : '330upx', marginTop:data.margin+'px',marginBottom: data.margin2+'px' }"
		>
		<!-- 商城 -->
			<swiper-item class="category-nav-content" v-for="(i, index) in count" :key="index">
				<view class='category-nav-item' v-for="(item, idx) in data.img_list"  @click="$LinkTo(item)" :key="idx" v-if="idx < (index + 1) * data.column * 2 && idx >= index * data.column * 2" :style="{width:100/data.column + '%'}">
					<view :class="['img', { circle: data.style.active === 'style-1' }]">
						<image mode="aspectFill" class="image" :src="item.url"></image>
					</view>
					<view v-if="data.is_show_title" class="title">{{item.title}}</view>
				</view>
			</swiper-item>
		<!-- 线下商城 -->
		</swiper>	
	</view>
</template>

<script>
	export default {
		name: 'category',
		props: {
			data: {
				type: Object,
				required: true
			}
		},
		computed: {
			count () {
				return Math.ceil(this.data.img_list.length / (this.data.column * 2))
			}
		}
	}
</script>

<style lang="less" scoped>
.category-nav {
    padding: 15upx 0;
    background-color: #fff;
	height: 150upx;
	.category-nav-content {
	    display: flex;
	    flex-wrap: wrap;
		overflow: hidden;
		.category-nav-item {
			height: 150upx;
		    display: flex;
		    align-items: center;
		    justify-content: center;
		    flex-direction: column;
			& > .img {
				width: 95upx;
				height: 95upx;
				.image {
					width:100%;
					height:100%;
				}
			}
			& > .circle {
				border-radius: 50%;
				overflow: hidden;
			}
			& > .title {
				font-size: 26upx;
				color: #666;
				margin-top: 3px;
			}
		}
	}
}

</style>
