<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" v-hasPermi="['workflow:task:resource:query']">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="流程名称">
                <a-input v-model="queryParam.processName" placeholder="请输入" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 增加修改 -->
      <create-form
        ref="createForm"
        @ok="getList"
      />
      <a-modal
        :title="title"
        :visible="open"
        :confirm-loading="submitLoading"
        @ok="submitForm"
        @cancel="cancel"
      >
        <a-form-model ref="form" :model="form" :rules="rules">
          <a-form-model-item label="选择用户" prop="assignee">
            <a-select
              v-model="form.assignee"
              placeholder="请选择">
              <a-select-option v-for="(d, index) in userList" :key="index" :value="d.value">
                {{ d.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 数据展示 -->
      <a-table
        :loading="loading"
        :size="tableSize"
        rowKey="taskId"
        :columns="columns"
        :data-source="list"
        :pagination="false"
        :bordered="tableBordered">
        <span slot="operation" slot-scope="text, record">
          <a @click="$refs.createForm.handleAudit(record)" v-hasPermi="['workflow:task:resource:audit']">
            <a-icon type="audit"/>
            审批
          </a>
          <a-divider type="vertical" v-hasPermi="['workflow:task:resource:resolve']"/>
          <a @click="resolveProcess(record)" v-hasPermi="['workflow:task:resource:resolve']">
            <a-icon type="user-delete" />
            处理
          </a>
          <a-divider type="vertical" v-hasPermi="['workflow:task:resource:transfer']"/>
          <a @click="handleProcess(record,0)" v-hasPermi="['workflow:task:resource:transfer']">
            <a-icon type="user" />
            转办
          </a>
          <a-divider type="vertical" v-hasPermi="['workflow:task:resource:delegate']"/>
          <a @click="handleProcess(record,1)" v-hasPermi="['workflow:task:resource:delegate']">
            <a-icon type="user-add" />
            委派
          </a>
        </span>
      </a-table>
      <!-- 分页 -->
      <a-pagination
        class="ant-table-pagination"
        show-size-changer
        show-quick-jumper
        :current="queryParam.pageNum"
        :total="total"
        :page-size="queryParam.pageSize"
        :showTotal="() => `共 ${total} 条`"
        @showSizeChange="onShowSizeChange"
        @change="changeSize"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { pageTask, delegateTask, transferTask, resolveTask } from '@/api/workflow/task'
import { getUserOption } from '@/api/v1/user'
import { tableMixin } from '@/store/table-mixin'
import { USER_ID } from '@/store/mutation-types'
import CreateForm from './modules/CreateForm'
import storage from 'store'
export default {
  name: 'Process',
  components: {
    CreateForm
  },
  mixins: [tableMixin],
  data () {
    return {
      list: [],
      loading: false,
      total: 0,
      userList: [],
      title: '',
      open: false,
      form: {
        userId: '',
        assignee: '',
        taskId: '',
        instanceId: '',
        businessKey: '',
        instanceName: ''
      },
      type: 0,
      submitLoading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        processName: ''
      },
      columns: [
        {
          title: '任务编号',
          dataIndex: 'taskId',
          align: 'center',
          ellipsis: true
        },
        {
          title: '流程名称',
          dataIndex: 'processName',
          align: 'center',
          ellipsis: true
        },
        {
          title: '任务名称',
          dataIndex: 'taskName',
          align: 'center',
          ellipsis: true
        },
        {
          title: '实例名称',
          dataIndex: 'processInstanceName',
          align: 'center',
          ellipsis: true
        },
        {
          title: '任务执行人',
          dataIndex: 'assigneeName',
          align: 'center',
          ellipsis: true
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center',
          width: '14%'
        },
        {
          title: '操作',
          width: '25%',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      rules: {
        assignee: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created () {
    this.getList()
    this.getUserList()
  },
  computed: {
  },
  watch: {
  },
  methods: {
    resolveProcess (row) {
      this.loading = true
      this.reset()
      this.form.businessKey = row.businessKey
      this.form.instanceId = row.processInstanceId
      this.form.instanceName = row.processInstanceName
      this.form.taskId = row.taskId
      resolveTask(this.form).then(() => {
        this.$message.success(
          '处理成功',
          3
        )
        this.getList()
      }).finally(() => {
        this.loading = false
      })
    },
    /** 查询流程定义列表 */
    getList () {
      this.loading = true
      pageTask(this.queryParam).then(response => {
          this.list = response.data.records
          this.total = response.data.total - 0
          this.loading = false
        }
      )
    },
    getUserList () {
      getUserOption().then(res => {
        const userId = storage.get(USER_ID)
        this.form.userId = userId
        this.userList = res.data.filter(function (row) {
          return row.value !== userId
        })
      })
    },
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 0转办 1委派
          const type = this.type
          this.submitLoading = true
          if (type === 0) {
            transferTask(this.form).then(() => {
              this.$message.success(
                '转办成功',
                3
              )
              this.getList()
            })
          } else {
            delegateTask(this.form).then(() => {
              this.$message.success(
                '委派成功',
                3
              )
              this.getList()
            })
          }
          this.open = false
          this.submitLoading = false
        } else {
          return false
        }
      })
    },
    handleProcess (row, type) {
      this.reset()
      this.type = type
      this.form.businessKey = row.businessKey
      this.form.instanceId = row.processInstanceId
      this.form.instanceName = row.processInstanceName
      this.form.taskId = row.taskId
      this.title = type === 0 ? '转办' : '委派'
      this.open = true
    },
    cancel () {
      this.open = false
    },
    reset () {
      this.form = {
        userId: this.form.userId,
        assignee: '',
        taskId: '',
        instanceId: '',
        businessKey: '',
        instanceName: ''
      }
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParam.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.dateRange = []
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
        processName: ''
      }
      this.handleQuery()
    },
    onShowSizeChange (current, pageSize) {
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    changeSize (current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.getList()
    }
  }
}
</script>
