<template>
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="审批意见" prop="comment">
        <a-input v-model="form.comment" placeholder="请输入审批意见" type="textarea" allow-clear />
      </a-form-model-item>
      <div class="bottom-control">
        <a-space>
          <a-button type="primary" :loading="submitLoading" @click="submitForm('1')">
            同意
          </a-button>
          <a-button type="danger" :loading="submitLoading"  @click="submitForm('0')">
            拒绝
          </a-button>
        </a-space>
      </div>
    </a-form-model>
  </a-drawer>
</template>

<script>

  import { auditTask } from '@/api/workflow/process'
export default {
  name: 'CreateForm',
  props: {

  },
  components: {
  },
  data () {
    return {
      submitLoading: false,
      formTitle: '',
      // 表单参数
      form: {
        comment: '',
        taskId:'',
        taskName:'',
        instanceId:'',
        values: {
          auditStatus: ''
        }
      },
      open: false,
      rules: {
        comment: [{ required: true, message: '审批意见不为空', trigger: 'blur' }],
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
        comment: '',
        taskId:'',
        taskName:'',
        instanceId:'',
        values: {
          auditStatus: ''
        }
      }
    },
     /** 新增按钮操作 */
    handleAudit (row) {
      this.form.taskId = row.taskId
      this.form.instanceId = row.processInstanceId
      this.form.taskName = row.taskName
      this.open = true
      this.formTitle = '审批'
    },
    /** 提交按钮 */
    submitForm: function (auditStatus) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.form.values.auditStatus = auditStatus
          auditTask(this.form).then(response => {
            this.$message.success(
              '审批成功',
              3
            )
            this.open = false
            this.$emit('ok')
          }).finally(() => {
            this.reset()
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
