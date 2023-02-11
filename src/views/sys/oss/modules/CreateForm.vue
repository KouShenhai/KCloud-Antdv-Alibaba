<template>
  <!-- 增加修改 -->
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="存储名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入" />
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

  import { getOss, addOss, updateOss } from '@/api/sys/oss'
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
          name: undefined,
          packageId: undefined,
          sourceId: ''
        },
        packageOption: [],
        sourceOption: [],
        open: false,
        rules: {
          name : [
            { required: true, message: '租户名称不能为空', trigger: 'blur' }
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
          name: undefined,
          packageId: undefined,
          sourceId: ''
        }
      },
      /** 新增按钮操作 */
      handleAdd () {
        this.reset()
        this.open = true
        this.formTitle = '存储新增'
      },
      /** 修改按钮操作 */
      handleUpdate (row) {
        this.reset()
        const id = row.id
        getOss(id).then(response => {
          this.form = response.data
          this.open = true
          this.formTitle = '存储修改'
        })
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.submitLoading = true
            if (this.form.id !== undefined) {
              updateOss(this.form).then(() => {
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
              addOss(this.form).then(() => {
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
