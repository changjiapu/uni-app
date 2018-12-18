<template>
<view class='cut-line' :style="{ marginTop: data.margin + 'px', marginBottom: data.margin2 + 'px' }">
    <view class='line'></view>
</view>
</template>

<script>
export default { 
	name:'cutline',
	props: {
		data: {
			type: Object,
			required: true
		}
	}
}
</script>

<style lang="less" scoped>
.cut-line {
	margin: 0 15px;
	.line {
		width: 100%;
		border-top:1px dashed #e4e4e4;
		box-sizing: border-box;
	}
}

</style>
