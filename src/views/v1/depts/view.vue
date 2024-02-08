<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" v-hasPermi="['depts:list']">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="部门名称">
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
      <!-- 操作 -->
      <div class="table-operations">
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPermi="['depts:create']">
          <a-icon type="plus" />新增
        </a-button>
        <table-setting
          :style="{float: 'right'}"
          :table-size.sync="tableSize"
          v-model="columns"
          :refresh-loading="loading"
          @refresh="getList" />
      </div>
      <!-- 增加修改 -->
      <create-form
        ref="createForm"
        :deptOptions="deptOptions"
        @ok="getList"
        @select-tree="getTreeSelect"
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
        <span slot="operation" slot-scope="text, record">
          <a @click="$refs.createForm.handleUpdate(record)" v-hasPermi="['depts:modify']">
            <a-icon type="edit" />修改
          </a>
          <a-divider type="vertical" v-hasPermi="['depts:create']"/>
          <a @click="$refs.createForm.handleAdd(record)" v-hasPermi="['depts:create']">
            <a-icon type="plus" />新增
          </a>
          <a-divider type="vertical" v-hasPermi="['depts:remove']"/>
          <a @click="handleDelete(record)" v-hasPermi="['depts:remove']">
            <a-icon type="delete" />删除
          </a>
        </span>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>

import { remove, list } from '@/api/v1/dept'
import CreateForm from './modules/CreateForm'
import { tableMixin } from '@/store/table-mixin'

export default {
  name: 'Depts',
  components: {
    CreateForm
  },
  mixins: [tableMixin],
  data () {
    return {
      list: [],
      // 部门树选项
      deptOptions: [],
      loading: false,
      queryTreeParam: {
        name: '',
        type: 'TREE_LIST'
      },
      queryParam: {
        name: '',
        type: 'LIST'
      },
      columns: [
        {
          title: '部门名称',
          dataIndex: 'name'
        },
        {
          title: '排序',
          dataIndex: 'sort',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '30%',
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
    /** 查询部门列表 */
    getList () {
      this.loading = true
      list(this.queryParam).then(response => {
          this.list = this.handleTree(response.data, 'id')
          this.loading = false
        }
      )
    },
    /** 查询菜单下拉树结构 */
    getTreeSelect () {
      this.deptOptions = []
      list(this.queryTreeParam).then(response => {
        const data = { id: 0, pid: '', name: '根目录', children: response.data, path: '0' }
        this.deptOptions.push(data)
      })
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.queryParam = {
        name: '',
        type: 'LIST'
      }
      this.handleQuery()
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const that = this
      const id = row.id
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + id + '的数据',
        onOk () {
          return remove([ id ])
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
