<template>
  <a-spin :spinning="loading" tip="加载中...">
    <div :style="'height:'+ height">
      <iframe
:src="src"
ref="frame"
frameborder="no"
style="width: 100%; height: 100%"
scrolling="auto" />
    </div>
  </a-spin>
</template>

<script>

export default {
  name: 'DB',
  components: {
  },
  data () {
    return {
      src: 'http://175.178.69.253:81/upload/node1/db.html',
      height: document.documentElement.clientHeight - 94.5 + 'px;',
      loading: true
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
  mounted: function () {
    setTimeout(() => {
      this.loading = false
    }, 230)
    const that = this
    window.onresize = function temp () {
      that.height = document.documentElement.clientHeight - 94.5 + 'px;'
    }
  },
  methods: {
  }
}
</script>