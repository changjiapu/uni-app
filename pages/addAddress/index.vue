<template>
	<com-address :item="{}"></com-address>
</template>

<script>
	import ComAddress from '../components/address'
	export default {
		name: 'newAddress',
		components: { ComAddress }
	}
</script>