<template>
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="流程名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入流程名称" />
      </a-form-model-item>
      <a-form-model-item label="流程图" prop="file">
      <a-upload name="file"  @change="uploadFile" accept=".xml" :before-upload="beforeUpload">
        <a-button :disabled="disabled">
          上传流程图
        </a-button>
      </a-upload>
      </a-form-model-item>
      <div class="bottom-control">
        <a-space>
          <a-button type="primary" :loading="submitLoading" @click="submitForm">
            保存
          </a-button>
          <a-button type="dashed" @click="cancel">
            取消
          </a-button>
        </a-space>
      </div>
    </a-form-model>
  </a-drawer>
</template>

<script>

import { insertDefinition } from '@/api/workflow/definition'
export default {
  name: 'CreateForm',
  props: {

  },
  components: {
  },
  data () {
    return {
      submitLoading: false,
      formTitle: '',
      fileData: {},
      // 表单参数
      form: {
        name: undefined
      },
      open: false,
      rules: {
        name: [{ required: true, message: '流程名称不为空', trigger: 'blur' }],
      },
      disabled: false
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
    onClose () {
      this.open = false
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset () {
      this.fileData = {}
      this.form = {
        name: ''
      }
    },
     /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.open = true
      this.formTitle = '流程新增'
    },
    beforeUpload () {
      return false
    },
    uploadFile (data) {
      if (data.fileList.length > 0) {
        this.disabled = true
      } else {
        this.disabled = false
      }
      this.fileData = data.file
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (Object.keys(this.fileData).length != 0) {
            this.submitLoading = true
            const formData = new FormData()
            formData.append('file', this.fileData)
            formData.append("name", this.form.name)
            insertDefinition(formData).then(response => {
              this.$message.success(
                '新增成功',
                3
              )
              this.open = false
              this.$emit('ok')
            }).finally(() => {
              this.submitLoading = false
              this.reset();
            })
          } else {
            this.$message.error(
              '请上传相关流程图',
              3
            )
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
