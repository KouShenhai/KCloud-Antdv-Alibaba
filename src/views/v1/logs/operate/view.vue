<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" v-hasPermi="['logs:operate-list']">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="模块名称">
                <a-input v-model="queryParam.moduleName" placeholder="请输入模块名称" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select placeholder="操作状态" v-model="queryParam.status" style="width: 100%" allow-clear>
                  <a-select-option v-for="(d, index) in statusOptions" :key="index" :value="d.value">{{ d.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
                <a-button v-hasPermi="['logs:operate-export']" :loading="exportLoading" type="danger" style="margin-left: 8px" @click="exportList"><a-icon type="export" />导出</a-button>
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
        :bordered="tableBordered"
        @change="handleTableChange"
      >
        <span slot="status" slot-scope="text, record">
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

import { operateExport, listOperate } from '@/api/v1/operate'
import { tableMixin } from '@/store/table-mixin'
import moment from 'moment'
export default {
  name: 'Operate',
  components: {
  },
  mixins: [tableMixin],
  data () {
    return {
      list: [],
      selectedRows: [],
      // 高级搜索 展开/关闭
      advanced: false,
      loading: false,
      // 非多个禁用
      multiple: true,
      total: 0,
      exportLoading: false,
      // 状态数据字典
      statusOptions: [
        {
          label: '成功', value: 0
        },
        {
          label: '失败', value: 1
        }
      ],
      typeOptions: [],
      // 日期范围
      dateRange: [],
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        moduleName: undefined,
        status: undefined
      },
      columns: [
        {
          title: '模块名称',
          dataIndex: 'moduleName',
          align: 'center'
        },
        {
          title: '操作名称',
          dataIndex: 'name',
          align: 'center',
          ellipsis: true
        },
        {
          title: '操作人员',
          dataIndex: 'operator',
          align: 'center'
        },
        {
          title: '请求方式',
          dataIndex: 'requestType',
          align: 'center'
        },
        {
          title: '请求地址',
          dataIndex: 'uri',
          align: 'center',
          ellipsis: true
        },
        {
          title: '主机',
          dataIndex: 'ip',
          width: '11%',
          align: 'center'
        },
        {
          title: '操作地点',
          dataIndex: 'address',
          align: 'center',
          ellipsis: true
        },
        {
          title: '浏览器',
          dataIndex: 'userAgent',
          align: 'center',
          ellipsis: true
        },
        {
          title: '方法名称',
          dataIndex: 'methodName',
          align: 'center',
          ellipsis: true
        },
        {
          title: '请求参数',
          dataIndex: 'requestParams',
          align: 'center',
          ellipsis: true
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          title: '错误信息',
          dataIndex: 'errorMessage',
          align: 'center',
          ellipsis: true
        },
        {
          title: '操作时间',
          dataIndex: 'createDate',
          align: 'center',
          width: '12%'
        },
        {
          title: '耗时（毫秒）',
          dataIndex: 'takeTime',
          align: 'center',
          width: '8%',
          ellipsis: true
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
    handleTableChange (pagination, filters, sorter) {
      const sort = this.tableSorter(sorter)
      this.queryParam.orderByColumn = sort.orderByColumn
      this.queryParam.isAsc = sort.isAsc
      this.getList()
    },
    exportList () {
      this.exportLoading = true
      operateExport(this.queryParam).then(res => {
        const filename = '操作日志_' + moment(new Date()).format('YYYYMMDDHHmmss') + '.xlsx'
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
    /** 查询登录日志列表 */
    getList () {
      this.loading = true
      listOperate(this.queryParam).then(response => {
          this.list = response.data.records
          this.total = response.data.total - 0
          this.loading = false
        }
      )
    },
    statusFormat (row, column) {
      if (row.status === 0) {
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
        moduleName: undefined,
        status: undefined
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
