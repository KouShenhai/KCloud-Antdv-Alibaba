<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :span="20">
          <div class="table-operations">
            <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPermi="['ips:create-white']">
              <a-icon type="plus" />新增
            </a-button>
            <a-button :loading="refreshLoading" type="danger" @click="refresh('white')" v-hasPermi="['ips:refresh-white']">
              <a-icon type="sync" /> 刷新
            </a-button>
          </div>
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
              <a @click="$refs.createForm.handleAdd()" v-hasPermi="['ips:create-white']">
                <a-icon type="plus" />新增
              </a>
              <a-divider type="vertical" v-hasPermi="['ips:remove-white']"/>
              <a @click="handleDelete(record)" v-hasPermi="['ips:remove-white']">
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

import { listWhite, removeWhite, refreshWhite } from '@/api/v1/ip'
import CreateForm from '@/views/v1/ips/white/modules/CreateForm.vue'
import { tableMixin } from '@/store/table-mixin'
export default {
  name: 'White',
  components: {
    CreateForm
  },
  mixins: [tableMixin],
  data () {
    return {
      list: [],
      refreshLoading: false,
      loading: false,
      total: 0,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        label: 'white'
      },
      columns: [
        {
          title: 'IP',
          dataIndex: 'value',
          align: 'center',
          ellipsis: true,
          width: '20%'
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
    refresh (label) {
      this.refreshLoading = true
      refreshWhite(label).then(() => {
        this.$message.success(
          '刷新缓存成功',
          3
        )
      }).catch().finally(() => {
        this.refreshLoading = false
      })
    },
    /** 查询存储列表 */
    getList () {
      this.loading = true
      listWhite(this.queryParam).then(response => {
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
        label: 'white'
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
          return removeWhite([ id ])
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
