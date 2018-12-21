<template>
<view>
	<view class="content">
	  <input bindinput="bindKeyInput" placeholder="关键字搜索" />
	</view>
	<view class="content">
	  <view :class="['list', {active: active_tab === 0}]" bindtap="selected" data-list="0">全部</view>
	  <view :class="['list', {active: active_tab === 1}]" bindtap="selected" data-list="1">普通团</view>
	  <view :class="['list', {active: active_tab === 3}]" bindtap="selected" data-list="3">秒杀团</view>
	  <view :class="['list', {active: active_tab === 2}]" bindtap="selected" data-list="2">抽奖团</view>
	  <view :class="['list', {active: active_tab === 4}]" bindtap="selected" data-list="4">超级团</view>
	</view>
	<view class="xiangqing" v-for="(item, idx) in product" :key="idx">
	  <view class="imgbox02">
		<view class="imgbo">
		  <image :src="baseURL + item.default_imgurl"></image>
		</view>
		<view class="ztai">
		  <image v-if="item.type === 1" src="/images/icon17.png"></image>
		  <image v-if="item.type === 3" src="/images/icon14.png"></image>
		  <image v-if="item.type === 2" src="/images/icon15.png"></image>
		  <image v-if="item.type === 4" src="/images/icon16.png"></image>
		</view>
	  </view>
	  <view class="textbox">
		<view class="p01">
		  <text>{{item.name}}</text>
		</view>
		<view class="p02">
		  <text></text>
		</view>
		<view class="p_array">
		  <view class="p04" style="font-size:15px;">
			<text decode>{{item.price}}元/人&nbsp;</text>
			<text class="p05" decode>{{item.group_size}}人团&nbsp;&nbsp;</text>
			<text class="p03">去开团</text>
		  </view>
		</view>
	  </view>
	  <view class="time" v-if="item.start_time || item.start_t">
		  <image v-if="item.type === (1 || 0)" class="timeImg1"   src="/images/icon20.png"></image>
		  <image v-if="item.type === 3" class="timeImg1" src="/images/icon13.png"></image>
		  <image v-if="item.type === 2" class="timeImg1" src="/images/icon19.png"></image>
		  <image v-if="item.type === 4" class="timeImg1" src="/images/icon18.png"></image>
		  <text class="timeS2" v-if="item.start_t">{{item.start_t}}</text>
		  <text class="timeS2" v-else>{{item.start_time}}至{{item.end_time}}</text>
	  </view>
	</view>

	<view class="timea">
	  <text class="timeS3">----已无更多活动----</text>
	</view>
</view>
</template>

<script>
	import { baseURL } from '@/common/utils/config'

	export default {
		data() {
			return {
				baseURL: baseURL
			};
		}
	}
</script>

<style>

</style>
