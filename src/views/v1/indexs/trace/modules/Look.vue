<template>
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="cancel">
    <a-divider orientation="left">
      <b>{{ title }}</b>
    </a-divider>
    <json-viewer :value="data"/>
  </a-drawer>
</template>

<script>
import { findTraceById } from '@/api/v1/idx'
import { tableMixin } from '@/store/table-mixin'
import JsonViewer from 'vue-json-viewer'
export default {
  name: 'Look',
  props: {

  },
  mixins: [tableMixin],
  components: {
    JsonViewer
  },
  data () {
    return {
      title: '',
      open: false,
      loading: false,
      data: ''
    }
  },
  filters: {
  },
  created () {
  },
  computed: {
  },
  watch: {
  },
  methods: {
    cancel () {
      this.open = false
    },
    look (r) {
      this.data = ''
      this.open = true
      this.title = '查看索引'
      this.get(r)
    },
    get (r) {
      this.loading = true
      findTraceById(r.id).then(res => {
        this.data = res.data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
