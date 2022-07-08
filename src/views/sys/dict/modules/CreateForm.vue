<template>
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="字典名称" prop="dictLabel">
        <a-input v-model="form.dictLabel" placeholder="请输入字典名称" />
      </a-form-model-item>

      <a-form-model-item label="字典值" prop="dictValue">
        <a-input v-model="form.dictValue" placeholder="请输入字典值" type="textarea" allow-clear />
      </a-form-model-item>

      <a-form-model-item label="字典类型" prop="type">
        <a-input v-model="form.type" placeholder="请输入字典类型" />
      </a-form-model-item>

      <a-form-model-item label="状态" prop="status">
        <a-select placeholder="请选择" v-model="form.status">
          <a-select-option v-for="(d, index) in statusOptions" :key="index" :value="d.value" >{{ d.label }}</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="排序" prop="sort">
        <a-input-number placeholder="请输入排序" v-model="form.sort" :min="0" style="width: 100%"/>
      </a-form-model-item>

      <a-form-model-item label="备注" prop="remark">
        <a-input v-model="form.remark" placeholder="请输入内容" type="textarea" allow-clear />
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

import { getDict, addDict, updateDict } from '@/api/sys/dict'

export default {
  name: 'CreateForm',
  props: {

  },
  components: {
  },
  data () {
    return {
      statusOptions: [
        {
          label: '正常',
          value: 0
        },
        {
          label: '停用',
          value: 1
        }
      ],
      submitLoading: false,
      formTitle: '',
      // 表单参数
      form: {
        id: undefined,
        dictLabel: undefined,
        type: undefined,
        status: 0,
        dictValue:'',
        sort: 1,
        remark: undefined
      },
      open: false,
      rules: {
        dictLabel: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
        dictValue: [{ required: true, message: '字典值不能为空', trigger: 'blur' }],
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
        dictLabel: undefined,
        type: undefined,
        status: 0,
        dictValue:'',
        sort: 1,
        remark: undefined
      }
    },
     /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.open = true
      this.formTitle = '字典新增'
    },
    /** 修改按钮操作 */
    handleUpdate (row, ids) {
      this.reset()
      const dictId = row ? row.id : ids
      getDict(dictId).then(response => {
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
            updateDict(this.form).then(response => {
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
            addDict(this.form).then(response => {
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
