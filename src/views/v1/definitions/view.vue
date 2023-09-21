<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" v-hasPermi="['definitions:list']">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="流程名称">
                <a-input v-model="queryParam.processName" placeholder="请输入流程名称" allow-clear/>
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
      <div class="table-operations">
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPermi="['definitions:insert']">
          <a-icon type="plus" />新增
        </a-button>
        <a-button @click="downloadTemplate" v-hasPermi="['definitions:template']">
          <a-icon type="download" />模板
        </a-button>
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
          <a @click="$refs.createForm.handleAdd()" v-hasPermi="['definitions:insert']">
            <a-icon type="plus" />
            新增
          </a>
          <a-divider type="vertical"  v-hasPermi="['definitions:suspend']"/>
          <a @click="suspendFlow(record)"  v-hasPermi="['definitions:suspend']">
            <a-icon type="pause-circle" />
            挂起
          </a>
          <a-divider type="vertical"  v-hasPermi="['definitions:activate']"/>
          <a @click="activateFlow(record)"  v-hasPermi="['definitions:activate']">
            <a-icon type="play-circle" />
            激活
          </a>
          <a-divider type="vertical"  v-hasPermi="['definitions:delete']"/>
          <a @click="handleDelete(record)"  v-hasPermi="['definitions:delete']">
            <a-icon type="delete" />
            删除
          </a>
          <a-divider type="vertical"  v-hasPermi="['definitions:diagram']"/>
          <a @click="getDefinition(record)"  v-hasPermi="['definitions:diagram']">
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
        :showTotal="() => `共 ${total} 条`"
        @showSizeChange="onShowSizeChange"
        @change="changeSize"
      />
    </a-card>
    <a-modal
      ref="noticeDetail"
      :width="900"
      :visible="visible"
      @cancel="close"
      :footer="null">
      <template slot="title" >
        <center><a-tag color="blue">流程图</a-tag></center>
      </template>
      <img :src="flowUri" style="width: 100%;height: 100%">
    </a-modal>
  </page-header-wrapper>
</template>

<script>

import { pageDefinition, delDefinition, suspendDefinition, activateDefinition, getDefinition, getTemplate } from '@/api/v1/definition'
import CreateForm from './modules/CreateForm'
import { tableMixin } from '@/store/table-mixin'
import moment from 'moment'
export default {
  name: 'Definition',
  components: {
    CreateForm
  },
  mixins: [tableMixin],
  data () {
    return {
      list: [],
      flowUri: '',
      visible: false,
      selectedRowKeys: [],
      selectedRows: [],
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
          width: '40%'
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
    downloadTemplate () {
      getTemplate().then(res => {
        const url = window.URL.createObjectURL(res) // 创建下载链接
        const link = document.createElement('a') // 赋值给a标签的href属性
        link.style.display = 'none'
        link.download = moment(new Date()).format('YYYYMMDDHHmmss') + '.bpmn20.xml'
        link.href = url
        document.body.appendChild(link) // 将a标签挂载上去
        link.click() // a标签click事件
        document.body.removeChild(link) // 移除a标签
        window.URL.revokeObjectURL(url) // 销毁下载链接
        this.$message.success(
          '下载成功',
          3
        )
      })
    },
    statusFormat (row) {
      if (row.suspended) {
        return '挂起'
      }
      return '激活'
    },
    close () {
      this.visible = false
      this.flowUri = ''
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
    getDefinition (row) {
      this.visible = true
      getDefinition(row.definitionId).then(res => {
         this.flowUri = 'data:image/png;base64,' + res.data
      })
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
    suspendFlow (row) {
      const that = this
      suspendDefinition(row.definitionId).then(() => {
        that.getList()
        this.$message.success(
          '挂起成功',
          3
        )
      })
    },
    activateFlow (row) {
      const that = this
      activateDefinition(row.definitionId).then(() => {
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
