<template>
	<com-temp :list="list" @on-del="delfoot" :noData="empty"></com-temp>
</template>

<script>
import ComTemp from '../components/comtemp'
import { footPrint, delFootprint } from '@/common/api'
import { mapState } from 'vuex'

export default {
	name: 'MyFoot',
	components: {
		ComTemp
	},
	data () {
		return {
			list: [],
			empty: false,
			params: {}
		}
	},
	onLoad () {
		this.params.user_id = this.userInfo.id || ''
		this.getList()
	},
	watch: {
		list: function(val, oldval) {
			if (!val.length) this.empty = true
		}
	},
	methods: {
		getList () {
			footPrint(this.params).then(res => {
				if (res.data.value) {
					this.list = res.data.value
				} else {
					this.empty = true
				}
			})
		},
		delfoot (item) {
			const id = item.visit_id
			this.list = this.list.filter(item => item.visit_id !== id)
			delFootprint({ id }).then(res => { console.log(res) })
		}
	},
	computed: {
		...mapState([
			'userInfo'
		])
	},
}
	
</script>

<style>
	uni-page-body, page { height: 100%;}
</style>