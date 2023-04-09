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
                    <a-input v-model="queryParam.username" placeholder="请输入用户名" allow-clear />
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
            <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPermi="['sys:user:insert']">
              <a-icon type="plus" />新增
            </a-button>
          </div>
          <!-- 创建/编辑用户,单独封装了组件 -->
          <create-form
            ref="createForm"
            @ok="getList"
            :deptOptions="deptOptions"
            @select-tree="getTreeSelect"
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
            :bordered="tableBordered">
            <span slot="status" slot-scope="text, record">
              {{ statusFormat(record) }}
            </span>
            <span slot="avatar" slot-scope="text, record">
              <img style="width:50px;height:50px" :src="record.avatar" />
            </span>
            <span slot="operation" slot-scope="text, record">
              <a @click="$refs.createForm.handleUpdate(record)" v-hasPermi="['sys:user:update']">
                <a-icon type="edit" />
                修改
              </a>
              <a-divider type="vertical" v-hasPermi="['sys:user:insert']"/>
              <a @click="$refs.createForm.handleAdd()" v-hasPermi="['sys:user:insert']">
                <a-icon type="plus" />新增
              </a>
              <a-divider type="vertical" v-hasPermi="['sys:user:status']" v-if="record.status == 1"/>
              <a @click="changeStatus(record)" v-hasPermi="['sys:user:status']" v-if="record.status == 1">
                <a-icon type="unlock" />启用
              </a>
              <a-divider type="vertical" v-hasPermi="['sys:user:status']" v-if="record.status == 0"/>
              <a @click="changeStatus(record)" v-hasPermi="['sys:user:status']" v-if="record.status == 0">
                <a-icon type="lock" />锁定
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
            :showTotal="() => `共 ${total} 条`"
            @showSizeChange="onShowSizeChange"
            @change="changeSize"
          />
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>
<script>

import { listUser, delUser, updateStatus } from '@/api/sys/user'
import { treeSelect } from '@/api/sys/dept'
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
      // 部门树选项
      deptOptions: [{
        id: 0,
        name: '',
        children: []
      }],
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
          dataIndex: 'avatar',
          scopedSlots: { customRender: 'avatar' },
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
    changeStatus (row) {
      this.loading = true
      const id = row.id
      const status = (row.status + 1) % 2
      updateStatus(id, status).then(() => {
        const notice = status === 1 ? '锁定' : '启用'
        this.$message.success(
           notice + '成功',
          3
        )
        this.getList()
        this.loading = false
      })
    },
    statusFormat (row) {
      // 0：正常   1：锁定
      if (row.status === 1) {
        return '锁定'
      } else {
        return '正常'
      }
    },
    /** 查询部门下拉树结构 */
    getTreeSelect () {
      treeSelect().then(response => {
        this.deptOptions = response.data.children
      })
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
    /** 删除按钮操作 */
    handleDelete (row) {
      const that = this
      const userId = row.id
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + userId + '的数据',
        onOk () {
          return delUser(userId)
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
