<template>
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="标题" prop="title">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-model-item>

      <a-form-model-item label="资源" prop="uri">
        <a-input  v-model="form.uri" placeholder="请上传资源" />
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

import { getOauth, addOauth, updateOauth } from '@/api/sys/oauth'

export default {
  name: 'CreateForm',
  components: {
  },
  data () {
    return {
      submitLoading: false,
      formTitle: '',
      // 表单参数
      form: {
        id: undefined,
        title: undefined
      },
      open: false,
      rules: {
        clientId: [{ required: true, message: '应用id不能为空', trigger: 'blur' }],
        clientSecret: [{ required: true, message: '应用密钥不能为空', trigger: 'blur' }],
        types: [{ required: true, message: '授权类型不能为空', trigger: 'blur' }],
        scope: [{ required: true, message: '授权范围不能为空', trigger: 'blur' }],
        accessTokenValidity: [{ required: true, message: '令牌秒数不能为空', trigger: 'blur' }],
        refreshTokenValidity: [{ required: true, message: '刷新秒数不能为空', trigger: 'blur' }],
        webServerRedirectUri: [{ required: true, message: '回调地址不能为空', trigger: 'blur' }],
        autoapprove: [{ required: true, message: '自动授权不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
      }
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
      this.form = {
        id: undefined,
        title: undefined
      }
    },
     /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.form.id = undefined
      this.open = true
      this.formTitle = '认证新增'
    },
    /** 修改按钮操作 */
    handleUpdate (row, ids) {
      this.reset()
      const id = row ? row.id : ids
      getOauth(id).then(response => {
        this.form.id = response.data.id
        this.form.sort = response.data.sort
        this.form.accessTokenValidity = response.data.accessTokenValidity - 0
        this.form.additionalInformation = response.data.additionalInformation
        this.form.authorities =  response.data.authorities
        this.form.types =  response.data.authorizedGrantTypes.split(",")
        this.form.autoapprove = response.data.autoapprove
        this.form.clientId = response.data.clientId
        this.form.clientSecret = response.data.clientSecret
        this.form.refreshTokenValidity = response.data.refreshTokenValidity - 0
        this.form.resourceIds = response.data.resourceIds
        this.form.scope =  response.data.scope
        this.form.webServerRedirectUri =  response.data.webServerRedirectUri
        this.open = true
        this.formTitle = '认证修改'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          let types = this.form.types
          this.form.authorizedGrantTypes = types.join(",")
          if (this.form.id !== undefined) {
            updateOauth(this.form).then(response => {
              this.$message.success(
                '修改成功',
                3
              )
              this.open = false
              this.$emit('ok')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            addOauth(this.form).then(response => {
              this.$message.success(
                '新增成功',
                3
              )
              this.open = false
              this.$emit('ok')
            }).finally(() => {
              this.submitLoading = false
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
