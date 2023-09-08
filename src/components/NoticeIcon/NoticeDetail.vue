<template>
  <a-modal
    ref="noticeDetail"
    :width="900"
    :visible="visible"
    @cancel="close"
    :footer="null"
  >
    <template slot="title" >
      <center><a-tag color="blue">平台</a-tag>{{ form.title }}</center>
    </template>
    <mavon-editor
      class="md"
      :value="form.content"
      :ishljs="true"
      :subfield="prop.subfield"
      :defaultOpen="prop.defaultOpen"
      :toolbarsFlag="prop.toolbarsFlag"
      :editable="prop.editable"
      :scrollStyle="prop.scrollStyle"/>
  </a-modal>
</template>

<script>
  import { getByDetailId } from '@/api/v1/message'
export default {
  name: 'NoticeDetail',
  components: {
  },
  computed: {
    prop () {
      return {
        subfield: false, // 单双栏模式
        defaultOpen: 'preview', // edit： 默认展示编辑区域 ， preview： 默认展示预览区域
        editable: false,
        toolbarsFlag: false,
        scrollStyle: true,
      }
    }
  },
  data () {
    return {
      loading: false,
      loadingMore: false,
      showLoadingMore: true,
      visible: false,
      form: {
        title: '',
        content: ''
      }
    }
  },
  methods: {
    /** 修改按钮操作 */
    getNotice (row) {
      this.visible = true
      getByDetailId(row.id).then(response => {
        this.form.title = response.data.title
        this.form.content = response.data.content
      })
    },
    // 关闭模态框
    close () {
      this.visible = false
      this.form.title = ''
      this.form.content = ''
      this.$emit('ok')
    }
  }
}
</script>
<style lang="less" scoped>
  .notice-detail {
    /* table 样式 */
    /deep/ table {
      border-top: 1px solid #ccc;
      border-left: 1px solid #ccc;
    }
    /deep/ table td,
    table th {
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;
      padding: 3px 5px;
    }
    /deep/ table th {
      border-bottom: 2px solid #ccc;
      text-align: center;
    }

    /* blockquote 样式 */
    /deep/ blockquote {
      display: block;
      border-left: 8px solid #d0e5f2;
      padding: 5px 10px;
      margin: 10px 0;
      line-height: 1.4;
      font-size: 100%;
      background-color: #f1f1f1;
    }

    /* code 样式 */
    /deep/ code {
      display: inline-block;
      *display: inline;
      *zoom: 1;
      background-color: #f1f1f1;
      border-radius: 3px;
      padding: 3px 5px;
      margin: 0 3px;
    }
    /deep/ pre code {
      display: block;
    }

    /* ul ol 样式 */
    /deep/ ul, ol {
      margin: 10px 0 10px 20px;
    }
  }
  .v-note-wrapper{ z-index:1 !important; }
</style>
