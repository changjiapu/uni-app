
<template>
	<view>
		   <rich-text :nodes="nodes" ></rich-text>
	</view>
</template>

<script>
	export default {
		name:'richtext',
		props:{
			data:{
				type:Object,
				required: true
			}
		},
   created(){

     },
		data() {
			return {
				nodes:this.data.placeholder
			};
		}
	}
</script>

<style>

</style>
