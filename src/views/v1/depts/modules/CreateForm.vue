<template>
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="上级部门" prop="pid">
        <a-tree-select
          v-model="form.pid"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="deptOptions"
          placeholder="请选择"
          :replaceFields="{children:'children', title:'name', key:'id', value: 'id', path: 'path' }"
          tree-default-expand-all
        >
        </a-tree-select>
      </a-form-model-item>
      <a-form-model-item label="部门名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="排序" prop="sort">
        <a-input-number v-model="form.sort" :min="1" :max="9999" style="width: 100%"/>
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

import { getDeptById, insertDept, updateDept } from '@/api/v1/dept'
import { getToken } from '@/api/v1/token'

export default {
  name: 'CreateForm',
  props: {
    deptOptions: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      accessToken: '',
      submitLoading: false,
      formTitle: '',
      // 表单参数
      form: {
        id: undefined,
        pid: undefined,
        name: undefined,
        sort: 1
      },
      open: false,
      rules: {
        pid: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
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
        pid: undefined,
        name: undefined,
        sort: 1
      }
    },
     /** 新增按钮操作 */
    handleAdd (row) {
      this.reset()
      this.token()
      this.$emit('select-tree')
       if (row != null && row.id) {
         this.form.pid = row.id
       } else {
         this.form.pid = 0
       }
      this.open = true
      this.formTitle = '添加部门'
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset()
      this.$emit('select-tree', row)
      const deptId = row.id
      getDeptById(deptId).then(response => {
        this.form = response.data
        this.open = true
        this.formTitle = '修改部门'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          if (this.form.id !== undefined) {
            const data = { deptCO: this.form }
            updateDept(data).then(() => {
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
            const data = { deptCO: this.form }
            insertDept(data, this.accessToken).then(() => {
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
