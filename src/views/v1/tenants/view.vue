<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :span="20">
          <!-- 条件搜索 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline" v-hasPermi="['tenants:list']">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-item label="租户名称">
                    <a-input v-model="queryParam.name" placeholder="请输入" allow-clear />
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
            <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPermi="['tenants:create']">
              <a-icon type="plus" />新增
            </a-button>
          </div>
          <!-- 创建/编辑用户,单独封装了组件 -->
          <create-form
            ref="createForm"
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
            <span slot="operation" slot-scope="text, record">
              <a @click="$refs.createForm.handleUpdate(record)" v-hasPermi="['tenants:modify']">
                <a-icon type="edit" />
                修改
              </a>
              <a-divider type="vertical" v-hasPermi="['tenants:create']"/>
              <a @click="$refs.createForm.handleAdd()" v-hasPermi="['tenants:create']">
                <a-icon type="plus" />新增
              </a>
              <a-divider type="vertical" v-hasPermi="['tenants:remove']"/>
              <a @click="handleDelete(record)" v-hasPermi="['tenants:remove']">
                <a-icon type="delete" />
                删除
              </a>
              <a-divider type="vertical" v-hasPermi="['tenants:download-datasource']"/>
              <a @click="download(record)" v-hasPermi="['tenants:download-datasource']">
                <a-icon type="download" />下载
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

import { list, remove, downloadDatasource } from '@/api/v1/tenant'
import CreateForm from '@/views/v1/tenants/modules/CreateForm'
import { tableMixin } from '@/store/table-mixin'
import moment from 'moment/moment'
export default {
  name: 'Tenant',
  components: {
    CreateForm
  },
  mixins: [tableMixin],
  data () {
    return {
      list: [],
      loading: false,
      total: 0,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        name: undefined
      },
      columns: [
        {
          title: '租户名称',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '租户标签',
          dataIndex: 'label',
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
    /** 查询租户列表 */
    getList () {
      this.loading = true
      list(this.queryParam).then(response => {
          this.list = response.data.records
          this.total = response.data.total - 0
          this.loading = false
        }
      )
    },
    download (row) {
      this.loading = true
      downloadDatasource(row.id).then(res => {
        const url = window.URL.createObjectURL(res) // 创建下载链接
        const link = document.createElement('a') // 赋值给a标签的href属性
        link.style.display = 'none'
        link.download = '多租户数据库_' + moment(new Date()).format('YYYYMMDDHHmmss') + '.zip'
        link.href = url
        document.body.appendChild(link) // 将a标签挂载上去
        link.click() // a标签click事件
        document.body.removeChild(link) // 移除a标签
        window.URL.revokeObjectURL(url) // 销毁下载链接
        this.loading = false
        this.$message.success(
          '下载成功',
          3
        )
      })
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
        name: undefined
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
