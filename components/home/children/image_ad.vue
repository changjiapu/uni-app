<template>
	<view class='image-ad' :style="{marginTop: data.margin + 'px',marginBottom: data.margin2 + 'px'}">
		<image :src='data.img.url' mode='widthFix' style='width:100%' :data-item="data.img" @click="$LinkTo(data.img)"></image>
	</view>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            value: {},
        }
    },

    /**
     * 组件的初始数据
     */
    data: function(){
		return {}
	},

    /**
     * 组件的方法列表
     */
    methods: {
        linkto(e) {
            app.linkto(e.currentTarget.dataset.item);
        }
    }
};
</script>

<style scoped>
.image-ad .title {
    line-height: 90rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: #555;
    text-indent: 30rpx;
    background-color: #ffffff;
}
</style>
