<template>
  <!-- 增加修改 -->
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="用户名" prop="userName" v-if="form.id == undefined">
        <a-input v-model="form.username" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="密码" prop="password" v-if="form.id == undefined">
        <a-input-password v-model="form.password" placeholder="请输入" :maxLength="20" />
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

  import { addUser, updateUser } from '@/api/sys/user'
  export default {
    name: 'CreateForm',
    components: {

    },
    data () {
      return {
        submitLoading: false,
        // 默认密码
        formTitle: '',
        // 表单参数
        form: {
          id: undefined,
          username: undefined,
          password: undefined,
          driverClassName: undefined,
          name: undefined,
          url: undefined
        },
        open: false,
        rules: {
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
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
          username: undefined,
          password: undefined,
          driverClassName: undefined,
          name: undefined,
          url: undefined
        }
      },
      /** 新增按钮操作 */
      handleAdd () {
        this.reset()
        this.open = true
        this.formTitle = '数据源新增'
      },
      /** 修改按钮操作 */
      handleUpdate (row) {
        this.reset()
        this.open = true
        this.formTitle = '数据源修改'
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.submitLoading = true
            if (this.form.id !== undefined) {
              updateUser(this.form).then(() => {
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
              addUser(this.form).then(() => {
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
