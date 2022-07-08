<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
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
      <!-- 数据展示 -->
      <a-table
        :loading="loading"
        :size="tableSize"
        rowKey="definitionId"
        :columns="columns"
        :data-source="list"
        :pagination="false"
        :bordered="tableBordered">
        <span slot="suspended" slot-scope="text, record">
          {{ statusFormat(record) }}
        </span>
        <span slot="operation" slot-scope="text, record">
          <a @click="$refs.createForm.handleAdd()" >
            <a-icon type="plus" />
            新增
          </a>
          <a-divider type="vertical" />
          <a @click="suspendFlow(record)" >
            <a-icon type="pause-circle" />
            挂起
          </a>
          <a-divider type="vertical" />
          <a @click="activateFlow(record)" >
            <a-icon type="play-circle" />
            激活
          </a>
          <a-divider type="vertical" />
          <a @click="startFlow(record)">
            <a-icon type="cluster" />
            发起
          </a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record)" >
            <a-icon type="delete" />
            删除
          </a>
          <a-divider type="vertical" />
          <a @click="getDefinition(record)" >
            <a-icon type="eye" />
            查看
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
        :showTotal="total => `共 ${total} 条`"
        @showSizeChange="onShowSizeChange"
        @change="changeSize"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>

import { pageDefinition, delDefinition,suspendDefinition,activateDefinition,startProcess } from '@/api/workflow/definition'
import CreateForm from './modules/CreateForm'
import { tableMixin } from '@/store/table-mixin'
export default {
  name: 'Definition',
  components: {
    CreateForm
  },
  mixins: [tableMixin],
  data () {
    return {
      list: [],
      selectedRowKeys: [],
      selectedRows: [],
      // 高级搜索 展开/关闭
      single: true,
      // 非多个禁用
      multiple: true,
      ids: [],
      loading: false,
      total: 0,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        processName: ''
      },
      columns: [
        {
          title: '流程标识',
          dataIndex: 'processKey',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '流程名称',
          dataIndex: 'processName',
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'suspended',
          scopedSlots: { customRender: 'suspended' },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
          width: '40%',
        }
      ]
    }
  },
  filters: {
  },
  created () {
    this.getList()
  },
  computed: {
  },
  watch: {
  },
  methods: {
    statusFormat(row) {
      if (row.suspended) {
        return '挂起'
      }
      return '激活'
    },
    startFlow(row) {
      const that = this
      startProcess(row.definitionId).then(response => {
        that.getList()
        this.$message.success(
          '发起成功',
          3
        )
      })
    },
    /** 查询流程定义列表 */
    getList () {
      this.loading = true
      pageDefinition(this.queryParam).then(response => {
          this.list = response.data.records
          this.total = response.data.total - 0
          this.loading = false
        }
      )
    },
    getDefinition(row) {
      window.open(process.env.VUE_APP_BASE_API + "/admin/workflow/definition/api/image?definitionId=" + row.definitionId)
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
    suspendFlow(row) {
      const that = this
      suspendDefinition(row.definitionId).then(response => {
        that.getList()
        this.$message.success(
          '挂起成功',
          3
        )
      })
    },
    activateFlow(row) {
      const that = this
      activateDefinition(row.definitionId).then(response => {
        that.getList()
        this.$message.success(
          '激活成功',
          3
        )
      })
    },
    onShowSizeChange (current, pageSize) {
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    changeSize (current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const that = this
      const deploymentId = row.deploymentId
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + deploymentId + '的数据',
        onOk () {
          return delDefinition(deploymentId)
            .then(() => {
              that.getList()
              that.$message.success(
                '删除成功',
                3
              )
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>
