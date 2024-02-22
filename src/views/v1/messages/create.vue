<template>
  <page-header-wrapper @back="back">
    <template v-slot:breadcrumb>
      {{ formTitle }}
    </template>
    <template v-slot:title>
      {{ formTitle }}
    </template>
    <template v-slot:content>
    </template>
    <template v-slot:extraContent>
    </template>
    <template v-slot:extra>
      <a-space>
        <a-button type="primary" :loading="submitLoading" @click="submitForm">
          确定
        </a-button>
        <a-button type="dashed" :loading="submitLoading" @click="back()">
          取消
        </a-button>
      </a-space>
    </template>
    <a-card :bordered="false">
      <a-row :gutter="12">
        <a-col :span="24">
          <a-form-model ref="baseForm" :model="form" :rules="baseRules" :wrapper-col="wrapperCol">
            <a-form-model-item prop="title">
              <a-input size="large" v-model="form.title" placeholder="请输入标题" />
            </a-form-model-item>
            <a-form-model-item prop="content">
              <mavon-editor
                placeholder="请输入内容"
                v-model="form.content"
                :toolbars="toolbars"
                ref="content"
                :ishljs="true"
                @imgAdd="imgAdd"
                :subfield="prop.subfield"
                :defaultOpen="prop.defaultOpen"
                :editable="prop.editable"
                :scrollStyle="prop.scrollStyle"
              />
            </a-form-model-item>
            <a-form-model-item prop="receiver">
              <a-select
                mode="multiple"
                v-model="form.receiver"
                placeholder="请选择">
                <a-select-option v-for="(d, index) in userOptions" :key="index" :value="d.value">
                  {{ d.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-form-model>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>

import { insertMessage } from '@/api/v1/message'
import Editor from '@/components/Editor'
import { findOptionList } from '@/api/v1/user'
import { upload } from '@/api/v1/oss'
import { getToken } from '@/api/v1/token'
export default {
  name: 'NoticeForm',
  components: {
    Editor
  },
  data () {
    return {
      accessToken: '',
      userOptions: [],
      toolbars: {
        strikethrough: true, // 中划线
        subscript: true, // 下角标
        ul: true, // 无序列表
        imagelink: true, // 图片链接
        table: true, // 表格
        /* 1.3.5 */
        redo: true, // 下一步
        /* 1.4.2 */
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        preview: true, // 预览
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        mark: true, // 标记
        superscript: true, // 上角标
        quote: true, // 引用
        ol: true, // 有序列表
        link: true, // 链接
        help: true, // 帮助
        code: true, // code
        subfield: true, // 是否需要分栏
        readmodel: true, // 沉浸式阅读
        /* 1.3.5 */
        undo: true, // 上一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true // 导航目录
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 24 },
      submitLoading: false,
      total: 0,
      id: undefined,
      formTitle: '',
      // 状态数据字典
      statusOptions: [],
      typeOptions: [],
      idempotentToken: '',
      // 表单参数
      form: {
        title: '',
        content: '',
        receiver: [],
        type: 0
      },
      baseRules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        receiver: [{ required: true, message: '接收人不能为空', trigger: 'change' }]
      }
    }
  },
  filters: {
  },
  created () {
  },
  computed: {
    prop () {
      return {
        subfield: false, // 单双栏模式
        defaultOpen: 'edit', // edit： 默认展示编辑区域 ， preview： 默认展示预览区域
        editable: true,
        scrollStyle: true
      }
    }
  },
  watch: {
  },
  mounted () {
    this.formTitle = this.$route.params.formTitle
    this.handleAdd()
    findOptionList().then(response => {
      this.userOptions = response.data
    })
  },
  methods: {
    token () {
      getToken().then(res => {
        this.accessToken = res.data.token
      })
    },
    imgAdd (pos, file) {
      const imgData = new FormData()
      imgData.append('file', file)
      upload(imgData).then(res => {
        this.$refs.content.$img2Url(pos, res.data.url)
      })
    },
    // 表单重置
    reset () {
      this.form = {
        title: '',
        content: '',
        receiver: [],
        type: 0
      }
    },
     /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.token()
      this.formTitle = '新增消息'
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.baseForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          const data = { messageCO: this.form }
          insertMessage(data, this.accessToken).then(() => {
            this.$message.success(
              '发送成功',
              3
            )
            this.back()
          }).catch(() => {
            this.token()
          }).finally(() => {
            this.submitLoading = false
          })
        } else {
          return false
        }
      })
    },
    back () {
      this.reset()
      this.token()
      this.$router.push('/v1/messages/view')
    }
  }
}
</script>
<style lang="less" scoped>
  .v-note-wrapper{ z-index:1 !important; }
</style>
