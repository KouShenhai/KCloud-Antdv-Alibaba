<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" v-hasPermi="['sys:menu:query']">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="菜单名称">
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
      <div class="table-operations">
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPermi="['sys:menu:insert']">
          <a-icon type="plus" />新增
        </a-button>
      </div>
      <!-- 增加修改 -->
      <create-form
        ref="createForm"
        :menuOptions="menuOptions"
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
        <span slot="icon" slot-scope="text">
          <a-icon :component="allIcon[text + 'Icon']" v-if="allIcon[text + 'Icon']"/>
          <a-icon :type="text" v-if="!allIcon[text + 'Icon']"/>
        </span>
        <span slot="type" slot-scope="text, record">
          {{ typeFormat(record) }}
        </span>
        <span slot="operation" slot-scope="text, record">
          <a @click="$refs.createForm.handleUpdate(record)" v-hasPermi="['sys:menu:update']">
            <a-icon type="edit" />修改
          </a>
          <a-divider type="vertical" v-hasPermi="['sys:menu:insert']" />
          <a @click="$refs.createForm.handleAdd(record)" v-hasPermi="['sys:menu:insert']">
            <a-icon type="plus" />新增
          </a>
          <a-divider type="vertical" v-if="record.id != 0" v-hasPermi="['sys:menu:delete']" />
          <a @click="handleDelete(record)" v-if="record.id != 0" v-hasPermi="['sys:menu:delete']">
            <a-icon type="delete" />删除
          </a>
        </span>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>

import { listMenu, delMenu } from '@/api/sys/menu'
import CreateForm from './modules/CreateForm'
import allIcon from '@/core/icons'
import { tableMixin } from '@/store/table-mixin'

export default {
  name: 'Menu',
  components: {
    CreateForm
  },
  mixins: [tableMixin],
  data () {
    return {
      allIcon,
      iconVisible: false,
      list: [],
      // 部门树选项
      menuOptions: [],
      loading: false,
      queryParam: {
        name: ''
      },
      columns: [
        {
          title: '菜单名称',
          dataIndex: 'name',
          ellipsis: true,
          width: '20%'
        },
        {
          title: '菜单图标',
          dataIndex: 'icon',
          scopedSlots: { customRender: 'icon' },
          align: 'center',
          width: '10%'
        },
        {
          title: '菜单顺序',
          dataIndex: 'sort',
          align: 'center',
          width: '10%'
        },
        {
          title: '认证等级',
          dataIndex: 'authLevel',
          scopedSlots: { customRender: 'authLevel' },
          align: 'center',
          width: '10%'
        },
        {
          title: '菜单类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          align: 'center',
          width: '10%'
        },
        {
          title: '权限标识',
          dataIndex: 'permission',
          ellipsis: true,
          align: 'center',
          width: '20%'
        },
        {
          title: '菜单路径',
          dataIndex: 'url',
          ellipsis: true,
          align: 'center',
          width: '20%'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
          width: '20%'
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
    /** 查询菜单列表 */
    getList () {
      this.loading = true
      listMenu(this.queryParam).then(response => {
          this.list = this.handleTree(response.data, 'id')
          this.loading = false
        }
      )
    },
    typeFormat (row) {
      // 0：菜单   1：按钮
      if (row.type === 0) {
        return '菜单'
      } else {
        return '按钮'
      }
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.queryParam = {
        name: ''
      }
      this.handleQuery()
    },
    /** 查询菜单下拉树结构 */
    getTreeSelect () {
      const query = { name: '' }
      listMenu(query).then(response => {
        this.menuOptions = []
        const menu = { id: 0, name: '主目录', children: [] }
        menu.children = this.handleTree(response.data, 'id')
        this.menuOptions.push(menu)
      })
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const that = this
      const menuId = row.id
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + menuId + '的数据',
        onOk () {
          return delMenu(menuId)
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
