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
        rowKey="taskId"
        :columns="columns"
        :data-source="list"
        :pagination="false"
        :bordered="tableBordered">
        <span slot="operation" slot-scope="text, record">
          <a @click="$refs.createForm.handleAudit(record)" >
            <a-icon type="audit" />
            审批
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

import { pageProcess } from '@/api/workflow/process'
import { tableMixin } from '@/store/table-mixin'
import CreateForm from './modules/CreateForm'
export default {
  name: 'Process',
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
          title: '任务编号',
          dataIndex: 'taskId',
          align: 'center'
        },
        {
          title: '任务名称',
          dataIndex: 'taskName',
          align: 'center'
        },
        {
          title: '任务执行人',
          dataIndex: 'assigneeName',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          align: 'center'
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
    /** 查询流程定义列表 */
    getList () {
      this.loading = true
      pageProcess(this.queryParam).then(response => {
          this.list = response.data.records
          this.total = response.data.total - 0
          this.loading = false
        }
      )
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
