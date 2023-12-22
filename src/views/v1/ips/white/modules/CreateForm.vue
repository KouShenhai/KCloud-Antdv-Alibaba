<template>
  <!-- 增加修改 -->
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="IP" prop="value">
        <a-input v-model="form.value" placeholder="请输入" />
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

import { insertWhite } from '@/api/v1/ip'
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
          label: 'white',
          value: ''
        },
        packageOption: [],
        sourceOption: [],
        open: false,
        rules: {
          value: [
            { required: true, message: 'IP不能为空', trigger: 'blur' }
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
          label: 'white',
          value: ''
        }
      },
      /** 新增按钮操作 */
      handleAdd () {
        this.reset()
        this.token()
        this.open = true
        this.formTitle = '存储新增'
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.submitLoading = true
            const data = { ipCO: this.form }
            insertWhite(data, this.accessToken).then(() => {
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
          } else {
            return false
          }
        })
      }
    }
  }
</script>
