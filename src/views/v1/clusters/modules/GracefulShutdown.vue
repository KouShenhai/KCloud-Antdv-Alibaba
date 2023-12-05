<template>
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="cancel">
    <a-divider orientation="left">
      <b>{{ title }}</b>
    </a-divider>
    <!-- 数据展示 -->
    <a-table
      :loading="loading"
      :size="tableSize"
      rowKey="host"
      :columns="columns"
      :data-source="list"
      :pagination="false"
      :bordered="tableBordered">
      <span slot="operation" slot-scope="text, record">
        <a @click="shutdown(record)" v-hasPermi="['clusters:graceful-shutdown']">
          <a-icon type="down" />
          下线
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
  </a-drawer>
</template>

<script>
import { listClusterInstance, gracefulShutdownInstance } from '@/api/v1/cluster'
import { tableMixin } from '@/store/table-mixin'
export default {
  name: 'GracefulShutdown',
  props: {

  },
  mixins: [tableMixin],
  components: {
  },
  data () {
    return {
      submitLoading: false,
      title: '',
      open: false,
      list: [],
      loading: false,
      total: 0,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        serviceId: ''
      },
      columns: [
        {
          title: '服务ID',
          dataIndex: 'serviceId',
          align: 'center'
        },
        {
          title: '主机',
          dataIndex: 'host',
          align: 'center'
        },
        {
          title: '端口',
          dataIndex: 'port',
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
  },
  computed: {
  },
  watch: {
  },
  methods: {
    cancel () {
      this.open = false
    },
    shutdown (r) {
      gracefulShutdownInstance(r).then(() => {
        this.$message.success(
          '请求成功',
          3
        )
      })
    },
    get (r) {
      this.open = true
      this.title = '实例列表'
      this.queryParam.serviceId = r.id
      this.getList()
    },
    getList () {
      this.loading = true
      listClusterInstance(this.queryParam).then(res => {
        this.list = res.data.records
        this.total = res.data.total - 0
        this.loading = false
      })
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
