<template>
	<com-temp :list="list" :noData="empty" @on-del="delfoot"></com-temp>
</template>

<script>
import ComTemp from '../components/comtemp'
import { myCollect, delCollect } from '@/common/api'
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
		list: function (val,oldVal) {
			if (!val.length) this.empty = true
		}
	},
	computed: {
		...mapState([
			'userInfo'
		])
	},
	methods: {
		getList () {
			myCollect(this.params).then(res => {
 				let obj = res.data.value
				if (obj.length) {
					this.list = obj
				} else {
					this.empty = true
				}
			})
		},
		delfoot (item) {
			const data = {
				product_id: item.id,
				is_collect: 0
			}
			this.list = this.list.filter(rst => rst.id !== item.id)
			delCollect(data).then(res => { console.log(res) })
		}
	}
}	
</script>

<style>
	uni-page-body, page { height: 100%;}
</style>