<template>
	<com-address :item="item"></com-address>
</template>

<script>
	import ComAddress from '../components/address'
	export default {
		name: 'editAddr',
		data () {
			return {
				item: {}
			}
		},
		components: { ComAddress },
		onLoad(e) {
			this.item = JSON.parse(e.item)
		}
	}
</script>