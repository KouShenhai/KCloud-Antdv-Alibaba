<template>
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form2">
      <a-form-model-item label="编号" prop="id">
        {{form2.id}}
      </a-form-model-item>
      <a-form-model-item label="类型" prop="code">
        <span v-show="form2.code == 'image'">图片</span>
        <span v-show="form2.code == 'video'">视频</span>
        <span v-show="form2.code == 'audio'">音频</span>
      </a-form-model-item>
      <a-form-model-item label="标题" prop="title">
        {{form2.title}}
      </a-form-model-item>
      <a-form-model-item label="资源" prop="url">
        <audio v-show="form2.code == 'audio'" loop='loop' :src="form2.url" controls='controls'><object :data="form2.url" ><embed :src="form2.url" /></object></audio>
        <img v-show="form2.code == 'image'" :src="form2.url" width="100" height="100"/>
        <video
             v-show="form2.code == 'video'"
             :src='form2.url'
             loop='loop'
             width='250'
             height='100'
             controls='controls'><source :src='form2.url' type='video/mp4'><object :data='form2.url' width='200' height='100'><embed :src='form2.url' width='200' height='100' /></object></video>
      </a-form-model-item>
    </a-form-model>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="审批意见" prop="comment">
        <a-input v-model="form.comment" placeholder="请输入审批意见" type="textarea" allow-clear />
      </a-form-model-item>
      <div class="bottom-control">
        <a-space>
          <a-button type="primary" :loading="submitLoading" @click="submitForm('1')">
            同意
          </a-button>
          <a-button type="danger" :loading="submitLoading" @click="submitForm('0')">
            驳回
          </a-button>
        </a-space>
      </div>
    </a-form-model>
  </a-drawer>
</template>

<script>

  import { auditTask, detailTask } from '@/api/workflow/task'
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
      form2: {
        id: '',
        code: '',
        title: '',
        url: '',
        remark: ''
      },
      // 表单参数
      form: {
        comment: '',
        taskId: '',
        taskName: '',
        instanceId: '',
        businessKey: '',
        instanceName: '',
        definitionId: '',
        values: {
          auditStatus: ''
        }
      },
      open: false,
      rules: {
        comment: [{ required: true, message: '审批意见不为空', trigger: 'blur' }]
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
    getDetail (id) {
      detailTask(id).then(response => {
        this.form2.title = response.data.title
        this.form2.code = response.data.code
        this.form2.id = response.data.id
        this.form2.remark = response.data.remark
        this.form2.url = response.data.url
      })
    },
    // 表单重置
    reset () {
      this.form2 = {
        id: '',
        code: '',
        title: '',
        url: '',
        remark: ''
      }
      this.form = {
        comment: '',
        taskId: '',
        taskName: '',
        instanceId: '',
        businessKey: '',
        instanceName: '',
        definitionId: '',
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
      this.form.businessKey = row.businessKey
      this.form.instanceName = row.processInstanceName
      this.form.definitionId = row.definitionId
      this.getDetail(this.form.businessKey)
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
