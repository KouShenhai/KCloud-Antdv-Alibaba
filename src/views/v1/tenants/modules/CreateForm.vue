<template>
  <!-- 增加修改 -->
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="租户名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="租户套餐" prop="packageId">
        <a-select
          v-model="form.packageId"
          placeholder="请选择">
          <a-select-option v-for="(d, index) in packageOption" :key="index" :value="d.value">
            {{ d.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="租户数据源" prop="sourceId">
        <a-select
          v-model="form.sourceId"
          placeholder="请选择">
          <a-select-option v-for="(d, index) in sourceOption" :key="index" :value="d.value">
            {{ d.label }}
          </a-select-option>
        </a-select>
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

  import { findById, create, modify } from '@/api/v1/tenant'
  import { findOptionList as findSourceOptionList } from '@/api/v1/source'
  import { findOptionList as findPackageOptionList } from '@/api/v1/package'
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
          packageId: undefined,
          sourceId: ''
        },
        packageOption: [],
        sourceOption: [],
        open: false,
        rules: {
          name: [
            { required: true, message: '租户名称不能为空', trigger: 'blur' }
          ],
          packageId: [
            { required: true, message: '请选择套餐', trigger: 'blur' }
          ],
          sourceId: [
            { required: true, message: '请选择数据源', trigger: 'blur' }
          ]
        }
      }
    },
    filters: {
    },
    created () {
      this.getPackageOption()
      this.getSourceOption()
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
      getSourceOption () {
        findSourceOptionList().then(res => {
          this.sourceOption = res.data
        })
      },
      getPackageOption () {
        findPackageOptionList().then(res => {
          this.packageOption = res.data
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
          packageId: undefined,
          sourceId: ''
        }
      },
      /** 新增按钮操作 */
      handleAdd () {
        this.reset()
        this.token()
        this.open = true
        this.formTitle = '租户新增'
      },
      /** 修改按钮操作 */
      handleUpdate (row) {
        this.reset()
        const id = row.id
        findById(id).then(response => {
          this.form = response.data
          this.open = true
          this.formTitle = '租户修改'
        })
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.submitLoading = true
            if (this.form.id !== undefined) {
              const data = { tenantCO: this.form }
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
              const data = { tenantCO: this.form }
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
