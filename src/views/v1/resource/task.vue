<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" v-hasPermi="['resource:task-list']">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="流程名称">
                <a-input v-model="queryParam.name" placeholder="请输入" allow-clear/>
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
              v-model="form.userId"
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
          <a @click="$refs.createForm.handleAudit(record)" v-hasPermi="['resource:audit-task']">
            <a-icon type="audit"/>
            审批
          </a>
          <a-divider type="vertical" v-hasPermi="['resource:resolve-task']"/>
          <a @click="resolveProcess(record)" v-hasPermi="['resource:resolve-task']">
            <a-icon type="user-delete" />
            处理
          </a>
          <a-divider type="vertical" v-hasPermi="['resource:transfer-task']"/>
          <a @click="handleProcess(record,0)" v-hasPermi="['resource:transfer-task']">
            <a-icon type="user" />
            转办
          </a>
          <a-divider type="vertical" v-hasPermi="['resource:delegate-task']"/>
          <a @click="handleProcess(record,1)" v-hasPermi="['resource:delegate-task']">
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
import { listResourceTask, delegateResourceTask, resolveResourceTask, transferResourceTask } from '@/api/v1/resource'
import { listUserOption } from '@/api/v1/user'
import { tableMixin } from '@/store/table-mixin'
import { USER_ID } from '@/store/mutation-types'
import CreateForm from './modules/TaskForm'
import storage from 'store'
import { getToken } from '@/api/v1/token'
export default {
  name: 'Task',
  components: {
    CreateForm
  },
  mixins: [tableMixin],
  data () {
    return {
      accessToken: '',
      list: [],
      loading: false,
      total: 0,
      userList: [],
      title: '',
      open: false,
      form: {
        userId: '',
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
        name: ''
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
          dataIndex: 'name',
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
          dataIndex: 'instanceName',
          align: 'center',
          ellipsis: true
        },
        {
          title: '任务执行人',
          dataIndex: 'username',
          align: 'center',
          ellipsis: true
        },
        {
          title: '创建时间',
          dataIndex: 'createDate',
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
        userId: [
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
  mounted () {
    this.token()
  },
  watch: {
  },
  methods: {
    token () {
      getToken().then(res => {
        this.accessToken = res.data.token
      })
    },
    resolveProcess (row) {
      this.loading = true
      this.reset()
      this.form.taskId = row.taskId
      this.form.instanceId = row.instanceId
      this.form.businessKey = row.businessKey
      this.form.instanceName = row.instanceName
      resolveResourceTask(this.form, this.accessToken).then(() => {
        this.$message.success(
          '处理成功',
          3
        )
        this.getList()
      }).catch(() => {
        this.token()
      }).finally(() => {
        this.loading = false
      })
    },
    /** 查询流程定义列表 */
    getList () {
      this.loading = true
      listResourceTask(this.queryParam).then(response => {
          this.list = response.data.records
          this.total = response.data.total - 0
          this.loading = false
        }
      )
    },
    getUserList () {
      listUserOption().then(res => {
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
            transferResourceTask(this.form, this.accessToken).then(() => {
              this.$message.success(
                '转办成功',
                3
              )
              this.getList()
            }).catch(() => {
              this.token()
            })
          } else {
            delegateResourceTask(this.form, this.accessToken).then(() => {
              this.$message.success(
                '委派成功',
                3
              )
              this.getList()
            }).catch(() => {
              this.token()
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
      this.form.instanceId = row.instanceId
      this.form.instanceName = row.instanceName
      this.form.taskId = row.taskId
      this.title = type === 0 ? '转办' : '委派'
      this.open = true
    },
    cancel () {
      this.open = false
    },
    reset () {
      this.form = {
        userId: '',
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
        name: ''
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
