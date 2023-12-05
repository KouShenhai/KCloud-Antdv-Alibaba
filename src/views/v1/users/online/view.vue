<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" v-hasPermi="['users:online-list']">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名">
                <a-input v-model="queryParam.username" placeholder="请输入用户名" allow-clear/>
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
      <!-- 操作 -->
      <div class="table-operations">
        <table-setting
          :style="{float: 'right'}"
          :table-size.sync="tableSize"
          v-model="columns"
          :refresh-loading="loading"
          @refresh="getList" />
      </div>
      <!-- 数据展示 -->
      <a-table
        :loading="loading"
        :size="tableSize"
        rowKey="tokenId"
        :columns="columns"
        :data-source="list"
        :pagination="false"
        :bordered="tableBordered"
      >
        <span slot="operation" slot-scope="text, record">
          <a-popconfirm
            v-hasPermi="['users:online-kill']"
            ok-text="是"
            cancel-text="否"
            @confirm="confirmHandleForceLogout(record)"
            @cancel="cancelHandleForceLogout(record)"
          >
            <span slot="title">确认强制踢出 <b>{{ record.username }}</b> 吗?</span>
            <a> 强退 </a>
          </a-popconfirm>
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
import { listOnline, killOnline } from '@/api/v1/online'
import { tableMixin } from '@/store/table-mixin'
export default {
  name: 'Online',
  components: {
  },
  mixins: [tableMixin],
  data () {
    return {
      list: [],
      loading: false,
      total: 0,
      // 非多个禁用
      multiple: true,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        username: ''
      },
      columns: [
        {
          title: '令牌',
          dataIndex: 'token',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '用户名',
          dataIndex: 'username',
          align: 'center'
        },
        {
          title: '登录地址',
          dataIndex: 'loginIp',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '登录时间',
          dataIndex: 'loginDate',
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
    /** 查询登录日志列表 */
    getList () {
      this.loading = true
      listOnline(this.queryParam).then(res => {
          this.list = res.data.records
          this.total = res.data.total - 0
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
        username: ''
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
    /** 强退按钮操作 */
    confirmHandleForceLogout (row) {
      killOnline(row.token)
        .then(() => {
          this.getList()
          this.$message.success(
            '已强退踢出',
            3
          )
        }).catch(function () {
        this.$message.error(
          '发生异常',
          3
        )
      })
    },
    cancelHandleForceLogout (row) {
    }
  }
}
</script>
