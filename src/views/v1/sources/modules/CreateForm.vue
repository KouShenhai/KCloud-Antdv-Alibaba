<template>
  <!-- 增加修改 -->
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="数据源名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="数据源驱动" prop="driverClassName">
        <a-select
          v-model="form.driverClassName"
          placeholder="请选择">
          <a-select-option v-for="(d, index) in dictOption" :key="index" :value="d.value">
            {{ d.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="数据源连接" prop="url">
        <a-input v-model="form.url" placeholder="请输入" type="textarea" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="数据源用户名" prop="username">
        <a-input v-model="form.username" autocomplete="off" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="数据源密码" prop="password">
        <a-input-password v-model="form.password" autocomplete="off" placeholder="请输入" :maxLength="20" />
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

import { create, modify, findById } from '@/api/v1/source'
import { findOptionList } from '@/api/v1/dict'
import { getToken } from '@/api/v1/token'

  export default {
    name: 'CreateForm',
    components: {

    },
    data () {
      return {
        accessToken: '',
        submitLoading: false,
        // 默认密码
        formTitle: '',
        dictOption: [],
        // 表单参数
        form: {
          id: undefined,
          username: '',
          password: '',
          driverClassName: '',
          name: '',
          url: ''
        },
        open: false,
        rules: {
          username: [
            { required: true, message: '数据源用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '数据源密码不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '数据源名称不能为空', trigger: 'blur' }
          ],
          driverClassName: [
            { required: true, message: '请选择数据源驱动', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '数据源连接不能为空', trigger: 'blur' }
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
    mounted () {
      this.getDict()
    },
    methods: {
      token () {
        getToken().then(res => {
          this.accessToken = res.data.token
        })
      },
      getDict () {
        findOptionList('DRIVER_CLASS').then(res => {
          this.dictOption = res.data
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
          username: '',
          password: '',
          driverClassName: '',
          name: '',
          url: ''
        }
      },
      /** 新增按钮操作 */
      handleAdd () {
        this.reset()
        this.token()
        this.open = true
        this.formTitle = '数据源新增'
      },
      /** 修改按钮操作 */
      handleUpdate (row) {
        this.reset()
        this.open = true
        const id = row.id
        findById(id).then(res => {
          this.form.id = res.data.id
          this.form.name = res.data.name
          this.form.driverClassName = res.data.driverClassName
          this.form.password = res.data.password
          this.form.username = res.data.username
          this.form.url = res.data.url
        })
        this.formTitle = '数据源修改'
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.submitLoading = true
            if (this.form.id !== undefined) {
              const data = { sourceCO: this.form }
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
              const data = { sourceCO: this.form }
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
