<template>
  <!-- 增加修改 -->
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="终端地址" prop="endpoint">
        <a-input v-model="form.endpoint" placeholder="请输入" type="textarea" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="地域" prop="region">
        <a-input v-model="form.region" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="访问密钥" prop="accessKey">
        <a-input v-model="form.accessKey" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="用户密钥" prop="secretKey">
        <a-input-password v-model="form.secretKey" autocomplete="off" placeholder="请输入" :maxLength="20" />
      </a-form-model-item>
      <a-form-model-item label="桶名" prop="bucketName">
        <a-input v-model="form.bucketName" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="路径样式访问" prop="pathStyleAccessEnabled">
        <a-radio-group v-model="form.pathStyleAccessEnabled" button-style="solid">
          <a-radio-button value="1">已启动</a-radio-button>
          <a-radio-button value="0">未启用</a-radio-button>
        </a-radio-group>
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

import { findById, modify, create } from '@/api/v1/oss'
import { getToken } from '@/api/v1/token'

  export default {
    name: 'CreateForm',
    components: {

    },
    data () {
      return {
        accessToken: '',
        submitLoading: false,
        formTitle: '',
        // 表单参数
        form: {
          id: undefined,
          name: undefined,
          endpoint: undefined,
          region: undefined,
          accessKey: undefined,
          secretKey: undefined,
          bucketName: undefined,
          pathStyleAccessEnabled: '1',
          status: 0
        },
        packageOption: [],
        sourceOption: [],
        open: false,
        rules: {
          name: [
            { required: true, message: '租户名称不能为空', trigger: 'blur' }
          ],
          endpoint: [
            { required: true, message: '终端地址不能为空', trigger: 'blur' }
          ],
          accessKey: [
            { required: true, message: '访问密钥不能为空', trigger: 'blur' }
          ],
          secretKey: [
            { required: true, message: '用户密钥不能为空', trigger: 'blur' }
          ],
          bucketName: [
            { required: true, message: '桶名不能为空', trigger: 'blur' }
          ]
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
      token () {
        getToken().then(res => {
          this.accessToken = res.data.token
        })
      },
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
          name: undefined,
          endpoint: undefined,
          region: undefined,
          accessKey: undefined,
          secretKey: undefined,
          bucketName: undefined,
          pathStyleAccessEnabled: '1',
          status: 0
        }
      },
      /** 新增按钮操作 */
      handleAdd () {
        this.reset()
        this.token()
        this.open = true
        this.formTitle = '新增OSS'
      },
      /** 修改按钮操作 */
      handleUpdate (row) {
        this.reset()
        const id = row.id
        findById(id).then(response => {
          this.form = response.data
          this.form.pathStyleAccessEnabled = '' + response.data.pathStyleAccessEnabled
          this.form.status = '' + response.data.status
          this.open = true
          this.formTitle = '修改OSS'
        })
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.submitLoading = true
            if (this.form.id !== undefined) {
              const data = { ossCO: this.form }
              modify(data).then(() => {
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
              const data = { ossCO: this.form }
              create(data, this.accessToken).then(() => {
                this.$message.success(
                  '新增成功',
                  3
                )
                this.open = false
                this.$emit('ok')
              }).catch(() => {
                this.token()
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
