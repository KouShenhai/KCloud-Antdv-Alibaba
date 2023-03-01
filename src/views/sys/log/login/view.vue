<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" v-hasPermi="['sys:log:login:query']">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="登录名称">
                <a-input v-model="queryParam.loginName" style="width: 100%" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select placeholder="请选择状态" v-model="queryParam.requestStatus" style="width: 100%" allow-clear>
                  <a-select-option v-for="(d, index) in statusOptions" :key="index" :value="d.value">{{ d.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
                <a-button :loading="exportLoading" type="danger" style="margin-left: 8px" @click="exportList"><a-icon type="export" />导出</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 数据展示 -->
      <a-table
        :loading="loading"
        :size="tableSize"
        rowKey="id"
        :columns="columns"
        :data-source="list"
        :pagination="false"
        @change="handleTableChange"
        :bordered="tableBordered"
      >
        <span slot="requestStatus" slot-scope="text, record">
          {{ statusFormat(record) }}
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

import { list, exportList } from '@/api/sys/login'
import { tableMixin } from '@/store/table-mixin'
import moment from 'moment/moment'

export default {
  name: 'Login',
  components: {
  },
  mixins: [tableMixin],
  data () {
    return {
      list: [],
      selectedRows: [],
      // 高级搜索 展开/关闭
      loading: false,
      // 非多个禁用
      multiple: true,
      ids: [],
      exportLoading: false,
      total: 0,
      // 状态数据字典
      statusOptions: [
        {
          label: '成功', value: 0
        },
        {
          label: '失败', value: 1
        }
      ],
      // 日期范围
      dateRange: [],
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        loginName: undefined,
        requestStatus: undefined
      },
      columns: [
        {
          title: '用户名称',
          dataIndex: 'loginName',
          align: 'center',
          ellipsis: true
        },
        {
          title: '登录地址',
          dataIndex: 'requestIp',
          align: 'center',
          ellipsis: true
        },
        {
          title: '登录地点',
          dataIndex: 'requestAddress',
          align: 'center'
        },
        {
          title: '浏览器',
          dataIndex: 'browser',
          align: 'center',
          ellipsis: true
        },
        {
          title: '操作系统',
          dataIndex: 'os',
          align: 'center',
          ellipsis: true
        },
        {
          title: '登录状态',
          dataIndex: 'requestStatus',
          scopedSlots: { customRender: 'requestStatus' },
          align: 'center'
        },
        {
          title: '登录信息',
          dataIndex: 'msg',
          align: 'center'
        },
        {
          title: '登录时间',
          dataIndex: 'createDate',
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
    exportList () {
      this.exportLoading = true
      exportList(this.queryParam).then(res => {
        const filename = '登录日志_' + moment(new Date()).format('YYYYMMDDHHmmss') + '.xlsx'
        const url = window.URL.createObjectURL(res) // 创建下载链接
        const link = document.createElement('a') // 赋值给a标签的href属性
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link) // 将a标签挂载上去
        link.click() // a标签click事件
        document.body.removeChild(link) // 移除a标签
        window.URL.revokeObjectURL(url) // 销毁下载链接
        this.exportLoading = false
        this.$message.success(
          '导出成功',
          3
        )
      })
    },
    handleTableChange (pagination, filters, sorter) {
      const sort = this.tableSorter(sorter)
      this.queryParam.orderByColumn = sort.orderByColumn
      this.queryParam.isAsc = sort.isAsc
      this.getList()
    },
    /** 查询登录日志列表 */
    getList () {
      this.loading = true
      list(this.addDateRange(this.queryParam, this.dateRange)).then(response => {
          this.list = response.data.records
          this.total = response.data.total - 0
          this.loading = false
        }
      )
    },
    statusFormat (row, column) {
      if (row.requestStatus === 0) {
        return '成功'
      }
      return '失败'
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
        loginName: undefined,
        requestStatus: undefined
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
