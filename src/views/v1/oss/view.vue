<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :span="20">
          <!-- 条件搜索 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline" v-hasPermi="['oss:list']">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-item label="名称">
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
            <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPermi="['oss:insert']">
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
            <span slot="enabled" slot-scope="text, record">
              {{ enabledFormat(record) }}
            </span>
            <span slot="operation" slot-scope="text, record">
              <a @click="$refs.createForm.handleUpdate(record)" v-hasPermi="['oss:update']">
                <a-icon type="edit" />
                修改
              </a>
              <a-divider type="vertical" v-hasPermi="['oss:insert']"/>
              <a @click="$refs.createForm.handleAdd()" v-hasPermi="['oss:insert']">
                <a-icon type="plus" />新增
              </a>
              <a-divider type="vertical" v-hasPermi="['oss:delete']"/>
              <a @click="handleDelete(record)" v-hasPermi="['oss:delete']">
                <a-icon type="delete" />
                删除
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

import { listOss, deleteOssById } from '@/api/v1/oss'
import CreateForm from './modules/CreateForm'
import { tableMixin } from '@/store/table-mixin'
export default {
  name: 'Oss',
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
          title: '名称',
          dataIndex: 'name',
          align: 'center',
          ellipsis: true,
          width: '10%'
        },
        {
          title: '地域',
          dataIndex: 'region',
          align: 'center',
          ellipsis: true,
          width: '10%'
        },
        {
          title: '终端地址',
          dataIndex: 'endpoint',
          align: 'center',
          ellipsis: true,
          width: '10%'
        },
        {
          title: '访问密钥',
          dataIndex: 'accessKey',
          align: 'center',
          ellipsis: true,
          width: '10%'
        },
        {
          title: '用户密钥',
          dataIndex: 'secretKey',
          align: 'center',
          ellipsis: true,
          width: '10%'
        },
        {
          title: '桶名',
          dataIndex: 'bucketName',
          align: 'center',
          ellipsis: true,
          width: '10%'
        },
        {
          scopedSlots: { customRender: 'enabled' },
          title: '路径样式访问',
          dataIndex: 'pathStyleAccessEnabled',
          align: 'center',
          ellipsis: true,
          width: '10%'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
          width: '30%'
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
    enabledFormat (row) {
      // 1已开启 0未启用
      if (row.pathStyleAccessEnabled === 1) {
        return '已启用'
      } else {
        return '未启用'
      }
    },
    /** 查询OSS列表 */
    getList () {
      this.loading = true
      listOss(this.queryParam).then(response => {
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
    cancelHandleStatus (row) {

    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const that = this
      const id = row.id
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + id + '的数据',
        onOk () {
          return deleteOssById(id)
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
