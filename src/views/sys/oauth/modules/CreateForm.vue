<template>
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="应用id" prop="clientId">
        <a-input v-model="form.clientId" placeholder="请输入应用id" />
      </a-form-model-item>

      <a-form-model-item label="应用密钥" prop="clientSecret">
        <a-input v-model="form.clientSecret" placeholder="请输入应用密钥" />
      </a-form-model-item>

      <a-form-model-item label="授权类型" prop="authorizedGrantTypes">
        <a-checkbox-group v-model:value="form.authorizedGrantTypes" :options="typeOptions" />
      </a-form-model-item>

      <a-form-model-item label="授权范围" prop="scope">
        <a-input v-model="form.scope" placeholder="请输入授权范围" />
      </a-form-model-item>

      <a-form-model-item label="令牌秒数" prop="accessTokenValidity">
        <a-input-number :min="3600" v-model="form.accessTokenValidity" placeholder="请输入令牌秒数" style="width: 100%"/>
      </a-form-model-item>

      <a-form-model-item label="刷新秒数" prop="refreshTokenValidity">
        <a-input-number :min="7200" v-model="form.refreshTokenValidity" placeholder="请输入刷新秒数" style="width: 100%"/>
      </a-form-model-item>

      <a-form-model-item label="回调地址" prop="webServerRedirectUri">
        <a-input v-model="form.webServerRedirectUri" placeholder="请输入回调地址" type="textarea" allow-clear />
      </a-form-model-item>

      <a-form-model-item label="自动授权" prop="autoapprove">
        <a-radio-group v-model="form.autoapprove" button-style="solid">
          <a-radio-button value="true">是</a-radio-button>
          <a-radio-button value="false">否</a-radio-button>
        </a-radio-group>
      </a-form-model-item>

      <a-form-model-item label="排序" prop="sort">
        <a-input-number placeholder="请输入排序" v-model="form.sort" :min="0" style="width: 100%"/>
      </a-form-model-item>

      <a-form-model-item label="资源集合" prop="resourceIds">
        <a-input v-model="form.resourceIds" placeholder="请输入资源集合" />
      </a-form-model-item>

      <a-form-model-item label="权限" prop="authorities">
        <a-input v-model="form.authorities" placeholder="请输入权限" />
      </a-form-model-item>

      <a-form-model-item label="附加说明" prop="additionalInformation">
        <a-input v-model="form.additionalInformation" placeholder="请输入附加说明" />
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
  props: {

  },
  components: {
  },
  data () {
    return {
      typeOptions: [
        {
          label: 'authorization_code',
          value: 'authorization_code'
        },
        {
          label: 'refresh_token',
          value: 'refresh_token'
        },
        {
          label: 'password',
          value: 'password'
        },
        {
          label: 'implicit',
          value: 'implicit'
        },
        {
          label: 'client_credentials',
          value: 'client_credentials'
        }
      ],
      submitLoading: false,
      formTitle: '',
      // 表单参数
      form: {
        id: undefined,
        sort: 1,
        accessTokenValidity: "",
        additionalInformation: "",
        authorities: "",
        authorizedGrantTypes: [],
        autoapprove: "",
        clientId: "",
        clientSecret: "",
        refreshTokenValidity: "",
        resourceIds: "",
        scope: "",
        webServerRedirectUri: ""
      },
      open: false,
      rules: {
        clientId: [{ required: true, message: '应用id不能为空', trigger: 'blur' }],
        clientSecret: [{ required: true, message: '应用密钥不能为空', trigger: 'blur' }],
        authorizedGrantTypes: [{ required: true, message: '授权类型不能为空', trigger: 'blur' }],
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
        sort: 1,
        accessTokenValidity: "",
        additionalInformation: "",
        authorities: "",
        authorizedGrantTypes: [],
        autoapprove: "",
        clientId: "",
        clientSecret: "",
        refreshTokenValidity: "",
        resourceIds: "",
        scope: "",
        webServerRedirectUri: ""
      }
    },
     /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.open = true
      this.formTitle = '认证新增'
    },
    /** 修改按钮操作 */
    handleUpdate (row, ids) {
      this.reset()
      const id = row ? row.id : ids
      getOauth(id).then(response => {
        this.form = response.data
        console.log(this.form)
        this.open = true
        this.formTitle = '认证修改'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          if (this.form.id !== undefined) {
            this.form.authorizedGrantTypes = this.form.authorizedGrantTypes.join(",")
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
            this.form.authorizedGrantTypes = this.form.authorizedGrantTypes.join(",")
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
