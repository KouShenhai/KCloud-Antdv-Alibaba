<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" v-hasPermi="['sys:oauth:query']">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="应用id">
                <a-input v-model="queryParam.clientId" placeholder="请输入应用id" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="应用密钥">
                <a-input v-model="queryParam.clientSecret" placeholder="请输入应用密钥" allow-clear/>
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
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPermi="['sys:oauth:insert']">
          <a-icon type="plus" />新增
        </a-button>
      </div>
      <!-- 增加修改 -->
      <create-form
        ref="createForm"
        :statusOptions="statusOptions"
        @ok="getList"
      />
      <!-- 数据展示 -->
      <a-table
        :loading="loading"
        :size="tableSize"
        rowKey="id"
        :columns="columns"
        :data-source="list"
        :pagination="false"
        :bordered="tableBordered">
        <span slot="authorizedGrantTypes" slot-scope="text, record">
          {{ typeFormat(record) }}
        </span>
        <span slot="operation" slot-scope="text, record">
          <a @click="$refs.createForm.handleUpdate(record, undefined)" v-hasPermi="['sys:oauth:update']">
            <a-icon type="edit" />修改
          </a>
          <a-divider type="vertical" v-hasPermi="['sys:oauth:insert']"/>
          <a @click="$refs.createForm.handleAdd()" v-hasPermi="['sys:oauth:insert']">
            <a-icon type="plus" />新增
          </a>
          <a-divider type="vertical" v-hasPermi="['sys:oauth:delete']"/>
          <a @click="handleDelete(record)" v-hasPermi="['sys:oauth:delete']">
            <a-icon type="delete" />删除
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

import { listOauth, delOauth } from '@/api/sys/oauth'
import CreateForm from './modules/CreateForm'
import { tableMixin } from '@/store/table-mixin'

export default {
  name: 'Oauth',
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
      advanced: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      ids: [],
      loading: false,
      refreshing: false,
      total: 0,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        clientId: undefined,
        clientSecret: undefined,
      },
      columns: [
        {
          title: '应用id',
          dataIndex: 'clientId',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '应用密钥',
          dataIndex: 'clientSecret',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '授权范围',
          dataIndex: 'scope',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '授权类型',
          dataIndex: 'authorizedGrantTypes',
          scopedSlots: { customRender: 'authorizedGrantTypes' },
          ellipsis: true,
          align: 'center'
        },
        {
          title: '令牌秒数',
          dataIndex: 'accessTokenValidity',
          align: 'center'
        },
        {
          title: '回调地址',
          dataIndex: 'webServerRedirectUri',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '排序',
          dataIndex: 'sort',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '15%',
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
    /** 查询字典列表 */
    getList () {
      this.loading = true
      listOauth(this.queryParam).then(response => {
          this.list = response.data.records
          this.total = response.data.total - 0
          this.loading = false
        }
      )
    },
    // 参数系统内置字典翻译
    typeFormat (row) {
      return row.authorizedGrantTypes.replaceAll(',', " | ")
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
        clientId: undefined,
        clientSecret: undefined,
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
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const that = this
      const id = row.id
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中认证编号为' + id + '的数据',
        onOk () {
          return delOauth(id)
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
