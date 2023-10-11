<template>
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="字典名称" prop="dictLabel">
        <a-input v-model="form.label" placeholder="请输入字典名称" />
      </a-form-model-item>

      <a-form-model-item label="字典值" prop="dictValue">
        <a-input v-model="form.value" placeholder="请输入字典值" type="textarea" allow-clear />
      </a-form-model-item>

      <a-form-model-item label="字典类型" prop="type">
        <a-input v-model="form.type" placeholder="请输入字典类型" />
      </a-form-model-item>

      <a-form-model-item label="排序" prop="sort">
        <a-input-number placeholder="请输入排序" v-model="form.sort" :min="0" style="width: 100%"/>
      </a-form-model-item>

      <a-form-model-item label="备注" prop="remark">
        <a-input v-model="form.remark" placeholder="请输入备注" type="textarea" allow-clear />
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

import { getDictById, insertDict, updateDict } from '@/api/v1/dict'
import { getToken } from '@/api/v1/token'

export default {
  name: 'CreateForm',
  props: {

  },
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
        label: undefined,
        type: undefined,
        value: '',
        sort: 1,
        remark: undefined
      },
      open: false,
      rules: {
        label: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '字典值不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }]
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
        label: undefined,
        type: undefined,
        value: '',
        sort: 1,
        remark: undefined
      }
    },
     /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.token()
      this.open = true
      this.formTitle = '字典新增'
    },
    /** 修改按钮操作 */
    handleUpdate (row, ids) {
      this.reset()
      const id = row ? row.id : ids
      getDictById(id).then(response => {
        this.form = response.data
        this.open = true
        this.formTitle = '字典修改'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          if (this.form.id !== undefined) {
            const data = { dictCO: this.form }
            updateDict(data).then(() => {
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
            const data = { dictCO: this.form }
            insertDict(data, this.accessToken).then(() => {
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
