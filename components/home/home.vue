<template>
	<view class="main">
		<block v-for="(item,index) in data" :key="index">
			<!-- 轮播图 -->
			<banner v-if="item.name === 'banner'" :data="item"></banner>
			<!-- 搜索框 -->
			<searchwithlocation v-if="item.name ==='search_with_location'||item.name==='search'" :data="item"></searchwithlocation>
			<!-- 图片广告 -->
			<image-ad v-if="item.name === 'image_ad'" :data="item"></image-ad>
			<!-- category -->
			<category-nav v-if="item.name === 'category'" :data="item"></category-nav>
			<!-- 通知 -->
			<notice v-if="item.name === 'textPmd'" :data="item"></notice>
			<!-- 商品列表 -->
			<product-list v-if="item.name === 'product_list'" :data="item"></product-list>
			<!-- 橱窗二图 -->
			<showcase-two v-if="item.name==='showcase_two'" :data="item"></showcase-two>
			<!-- 滑动导航 -->
			<slide-nav v-if="item.name === 'slide_nav'" :data="item"></slide-nav>
			<!-- 品牌街 -->
			<brands v-if="item.name === 'brands'" :data="item"></brands>
			<!-- 橱窗三图 -->
			<showcase-three v-if="item.name === 'showcase_three'" :data="item"></showcase-three>
			<!-- 分割线 -->
            <cut-line v-if="item.name === 'cut_line'" :data="item"></cut-line>
			<!-- 展示卡片 -->
            <display-card v-if="item.name === 'display_card'" :data="item"></display-card>
			 <!-- 视频 -->
            <video-view v-if="item.name === 'video_u'" :data="item"> </video-view>
			<!-- 富文本组件 -->
			<richText v-if="item.name ==='rich_text'" :data="item"></richText>
			<!-- 音频 -->
			<audio-musie v-if="item.name === 'audio_musie'" :data="item"></audio-musie>
			<!-- 地图 -->
			<map-posit v-if="item.name === 'map_posit'" :data="item"></map-posit>
			<!-- 电话 -->
			<phone-tel v-if="item.name === 'phone_tel'" :data="item"></phone-tel>
			<!-- 横滑商品 -->
			<cross-skid v-if="item.name === 'cross_skid'" :data="item"></cross-skid>
			<!-- 店铺列表 -->
			<undermall-home v-if="item.name === 'UnderMall_home'" :data="item"></undermall-home>
			<!-- 左侧导航栏 -->
			<right-tabBar v-if="item.name === 'right_tabBar'" :data="item"></right-tabBar>
			<!-- 视频专区 -->
			<video-section v-if="item.name === 'video_section'"></video-section>
			<!-- 文章专区 -->
			<text-section v-if="item.name === 'text_section'"></text-section>			
		</block>
		<view class='liubai'></view>
	</view>
</template>

<script>
	import banner from '@/components/home/children/banner.vue';
	import searchwithlocation from '@/components/home/children/search_with_location.vue';
	import CategoryNav from '@/components/home/children/category.vue';
	import Notice from '@/components/home/children/notice.vue'
	import productList from'@/components/home/children/product_list.vue';
	import ShowcaseTwo from '@/components/home/children/showcase_two.vue';
	import SlideNav from '@/components/home/children/slidenav.vue';
	import Brands from '@/components/home/children/brands.vue';
	import showcaseThree from'@/components/home/children/showcase_three.vue'
	import CutLine from '@/components/home/children/cutline.vue'
	import DisplayCard from '@/components/home/children/displaycard.vue'
	import VideoView from '@/components/home/children/vidoeview.vue'
	import richText from '@/components/home/children/richtext.vue'
	import AudioMusie from '@/components/home/children/audiomusie.vue'
	import MapPosit from '@/components/home/children/map_posit.vue'
	import PhoneTel from '@/components/home/children/phonetel.vue'
	import CrossSkid from '@/components/home/children/cross_skid.vue'
	import UndermallHome from '@/components/home/children/undermallhome.vue'
	import RightTabBar from '@/components/home/children/right_tabBar.vue'
	import VideoSection from '@/components/home/children/videosection.vue'
	import TextSection from '@/components/home/children/textsection.vue'
	import ImageAd from '@/components/home/children/image_ad.vue'
	export default {
		name: "home",
		props: {
			data: {
				type: Array,
				required: true
			}
		},
		components: {
			banner,
			searchwithlocation,
			Notice,
			CategoryNav,
			productList,
			ShowcaseTwo,
			SlideNav,
			showcaseThree,
			Brands,
			CutLine,
			DisplayCard,
			VideoView,
			richText,
			AudioMusie,
			MapPosit,
			PhoneTel,
			CrossSkid,
			UndermallHome,
			RightTabBar,
			VideoSection,
			TextSection,
			ImageAd
			
		}
	}
</script>

<style scoped>
.main {
	position: relative; 
	z-index: 1;
	}
.liubai{
    height: 130upx;	
}
</style>
