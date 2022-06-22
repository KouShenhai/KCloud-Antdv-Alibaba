<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :span="20">
          <!-- 条件搜索 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline" v-hasPermi="['sys:user:query']">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-item label="用户名">
                    <a-input v-model="queryParam.username" placeholder="请输入" allow-clear />
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
          <!-- 创建/编辑用户,单独封装了组件 -->
          <create-form
            ref="createForm"
            @ok="getList"
          />
          <!-- 修改密码抽屉 -->
          <reset-password
            ref="resetPassword"
          />
          <!-- 数据展示 -->
          <a-table
            :loading="loading"
            :size="tableSize"
            rowKey="id"
            :columns="columns"
            :data-source="list"
            :pagination="false"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :bordered="tableBordered">
            <span slot="status" slot-scope="text, record">
              <a-popconfirm
                ok-text="是"
                cancel-text="否"
                @confirm="confirmHandleStatus(record)"
                @cancel="cancelHandleStatus(record)"
              >
                <span slot="title">确认<b>{{ record.status == '0' ? '停用' : '启用' }}</b>{{ record.username }}的用户吗?</span>
                <a-switch checked-children="开" un-checked-children="关" :checked="record.status == '0'" />
              </a-popconfirm>
            </span>
            <span slot="superAdmin" slot-scope="text, record">
              {{ superAdminFormat(record) }}
            </span>
            <span slot="imgUrl" slot-scope="text, record">
              <img style="width:50px;height:50px" :src="record.imgUrl" />
            </span>
            <span slot="operation" slot-scope="text, record" v-if="record.id !== 1">
              <a @click="$refs.createForm.handleUpdate(record)" v-hasPermi="['sys:user:update']">
                <a-icon type="edit" />
                修改
              </a>
              <a-divider type="vertical" v-hasPermi="['sys:user:insert']"/>
              <a @click="$refs.createForm.handleAdd()" v-hasPermi="['sys:user:insert']">
                <a-icon type="plus" />新增
              </a>
              <a-divider type="vertical" v-hasPermi="['sys:user:delete']"/>
              <a @click="handleDelete(record)" v-hasPermi="['sys:user:delete']">
                <a-icon type="delete" />
                删除
              </a>
              <a-divider type="vertical" v-hasPermi="['sys:user:password']"/>
              <a @click="$refs.resetPassword.handleResetPwd(record)" v-hasPermi="['sys:user:password']">
                <a-icon type="key" />
                重置密码
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
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>
<script>

import { listUser, delUser, changeUserStatus } from '@/api/sys/user'
import ResetPassword from './modules/ResetPassword'
import CreateForm from '@/views/sys/user/modules/CreateForm'
import { tableMixin } from '@/store/table-mixin'
export default {
  name: 'User',
  components: {
    ResetPassword,
    CreateForm
  },
  mixins: [tableMixin],
  data () {
    return {
      list: [],
      selectedRowKeys: [],
      selectedRows: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      ids: [],
      loading: false,
      total: 0,
      statusOptions: [
        {
          label: "正常",
          value: 0
        },
        {
          label: "停用",
          value: 1
        }
      ],
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        username: undefined,
        status: undefined
      },
      columns: [
        {
          title: '用户名称',
          dataIndex: 'username',
          align: 'center'
        },
        {
          title: '用户头像',
          dataIndex: 'imgUrl',
          scopedSlots: { customRender: 'imgUrl' },
          align: 'center'
        },
        {
          title: '用户状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createDate',
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'superAdmin',
          scopedSlots: { customRender: 'superAdmin' },
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
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.ids = this.selectedRows.map(item => item.userId)
      this.single = selectedRowKeys.length !== 1
      this.multiple = !selectedRowKeys.length
    },
    superAdminFormat(row) {
      if (row.superAdmin == '1') {
        return '超级管理员'
      }
      return ''
    },
    /** 查询用户列表 */
    getList () {
      this.loading = true
      listUser(this.queryParam).then(response => {
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
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
        username: undefined,
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
    },
    /* 用户状态修改 */
    confirmHandleStatus (row) {
      const text = row.status == '0' ? '关闭' : '启用'
      row.status = row.status == '0' ? '1' : '0'
      changeUserStatus(row)
      .then(() => {
        this.$message.success(
          text + '成功',
          3
        )
      }).catch(function () {
        this.$message.error(
          text + '异常',
          3
        )
      })
    },
    cancelHandleStatus (row) {

    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const that = this
      const userIds = row.id
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + userIds + '的数据',
        onOk () {
          return delUser(userIds)
            .then(() => {
              that.onSelectChange([], [])
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
