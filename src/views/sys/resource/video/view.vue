<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" v-hasPermi="['sys:resource:video:query']">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="视频编号">
                <a-input v-model="queryParam.id" placeholder="请输入视频编号" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="视频名称">
                <a-input v-model="queryParam.title" placeholder="请输入视频名称" allow-clear/>
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
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPermi="['sys:resource:video:insert']">
          <a-icon type="plus" />新增
        </a-button>
        <a-button :loading="incrementSyncLoading" @click="incrementSyncIndex()" v-hasPermi="['sys:resource:video:increment:syncIndex']">
          <a-icon type="redo" />增量同步
        </a-button>
        <a-button :loading="completeSyncLoading" type="danger" @click="completeSyncIndex()" v-hasPermi="['sys:resource:video:complete:syncIndex']">
          <a-icon type="undo" />全量同步
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
        <span slot="status" slot-scope="text, record">
          {{ statusFormat(record) }}
        </span>
        <span slot="operation" slot-scope="text, record" >
          <a @click="$refs.createForm.handleAdd()" v-hasPermi="['sys:resource:video:insert']">
            <a-icon type="plus" />新增
          </a>
          <a-divider type="vertical" v-hasPermi="['sys:resource:video:update']" v-if="record.status == 3 || record.status == 2"/>
          <a v-hasPermi="['sys:resource:video:update']" @click="$refs.createForm.handleUpdate(record, undefined)" v-if="record.status == 3 || record.status == 2">
            <a-icon type="edit" />修改
          </a>
          <a-divider type="vertical" v-if="record.status == 3 || record.status == 2" v-hasPermi="['sys:resource:video:delete']"/>
          <a @click="handleDelete(record)" v-if="record.status == 3 || record.status == 2" v-hasPermi="['sys:resource:video:delete']">
            <a-icon type="delete" />删除
          </a>
          <a-divider type="vertical" v-if="record.status == 3" v-hasPermi="['sys:resource:video:detail']"/>
          <a @click="handleQuery1(record)" v-if="record.status == 3" v-hasPermi="['sys:resource:video:detail']">
            <a-icon type="eye" />查看
          </a>
          <a-divider type="vertical" v-if="record.status != 3" v-hasPermi="['sys:resource:video:diagram']"/>
          <a @click="handleQuery2(record)" v-if="record.status != 3" v-hasPermi="['sys:resource:video:diagram']">
            <a-icon type="gold" />查看
          </a>
          <a-divider type="vertical" v-hasPermi="['sys:resource:audio:auditLog']"/>
          <a @click="handleQuery3(record)" v-hasPermi="['sys:resource:audio:auditLog']">
            <a-icon type="file" />审批日志
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
    <a-modal
      ref="noticeDetail"
      :width="900"
      :visible="visible"
      @cancel="close"
      :footer="null">
      <template slot="title" >
        <center><a-tag color="blue">视频</a-tag>{{ videoTitle }}</center>
      </template>
      <a-table
        v-show="visible3"
        rowKey="id"
        :columns="columns1"
        :data-source="list1"
        :pagination="false"
        :bordered="tableBordered">
        <span slot="auditStatus" slot-scope="text, record">
          {{ auditStatusFormat(record) }}
        </span>
      </a-table>
      <img v-show="visible2" :src="diagramUrl" style="width: 100%;height: 100%">
      <video
        v-show="visible1"
        :src="videoUrl"
        loop="loop"
        width="200"
        height="100"
        controls="controls"><source :src="videoUrl" type="video/mp4"><object :data="videoUrl" width="200" height="100"><embed :src="videoUrl" width="200" height="100" /></object></video>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import storage from 'store'
  import { listVideo, delVideo, getVideo, getAuditLog, completeSyncIndex, incrementSyncIndex } from '@/api/sys/video'
  import CreateForm from './modules/CreateForm'
  import { tableMixin } from '@/store/table-mixin'

  export default {
    name: 'ResourceVideo',
    components: {
      CreateForm
    },
    mixins: [tableMixin],
    data () {
      return {
        diagramUrl: '',
        videoTitle: '',
        videoUrl: '',
        list: [],
        selectedRowKeys: [],
        selectedRows: [],
        completeSyncLoading: false,
        incrementSyncLoading: false,
        // 高级搜索 展开/关闭
        advanced: false,
        visible1: false,
        visible2: false,
        visible3: false,
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        ids: [],
        loading: false,
        refreshing: false,
        total: 0,
        visible: false,
        // 状态数据字典
        statusOptions: [],
        // 日期范围
        dateRange: [],
        queryParam: {
          pageNum: 1,
          pageSize: 10,
          title: undefined,
          code: 'video',
          id: ''
        },
        columns: [
          {
            title: '标题',
            dataIndex: 'title',
            ellipsis: true,
            align: 'center'
          },
          {
            title: '作者',
            dataIndex: 'author',
            ellipsis: true,
            align: 'center'
          },
          {
            title: '状态',
            dataIndex: 'status',
            ellipsis: true,
            scopedSlots: { customRender: 'status' },
            align: 'center'
          },
          {
            title: '标签',
            dataIndex: 'tags',
            ellipsis: true,
            align: 'center'
          },
          {
            title: '备注',
            dataIndex: 'remark',
            ellipsis: true,
            align: 'center'
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: '26%',
            scopedSlots: { customRender: 'operation' },
            align: 'center'
          }
        ],
        columns1: [
          {
            title: '审核人',
            dataIndex: 'auditName',
            ellipsis: true,
            align: 'center'
          },
          {
            title: '审核时间',
            dataIndex: 'auditDate',
            ellipsis: true,
            align: 'center'
          },
          {
            title: '审核状态',
            dataIndex: 'auditStatus',
            ellipsis: true,
            scopedSlots: { customRender: 'auditStatus' },
            align: 'center'
          },
          {
            title: '审核意见',
            dataIndex: 'comment',
            ellipsis: true,
            align: 'center'
          }
        ],
        list1: []
      }
    },
    filters: {
    },
    created () {
      this.linkQuery()
    },
    computed: {
    },
    watch: {
      $route: function (to, from) {
        this.linkQuery()
      }
    },
    methods: {
      linkQuery () {
        const query = this.$route.query
        if (JSON.stringify(query) !== '{}') {
          this.queryParam.id = query.id
        }
        this.getList()
      },
      incrementSyncIndex () {
        const that = this
        that.incrementSyncLoading = true
        incrementSyncIndex().then(res => {
          that.incrementSyncLoading = false
          if (res.code !== 200) {
            that.$message.error(
              res.msg,
              3
            )
          }
        })
      },
      completeSyncIndex () {
        const that = this
        that.completeSyncLoading = true
        completeSyncIndex().then(res => {
          that.completeSyncLoading = false
          if (res.code !== 200) {
            that.$message.error(
              res.msg,
              3
            )
          }
        })
      },
      auditStatusFormat (res) {
        if (res.auditStatus === 0) {
          return '审批驳回'
        } else if (res.auditStatus === 1) {
          return '审批通过'
        }
      },
      // 关闭模态框
      close () {
        this.visible = false
        this.diagramUrl = ''
        this.videoUrl = ''
        this.videoTitle = ''
        this.visible3 = false
        this.list1 = []
        this.visible1 = false
        this.visible2 = false
      },
      handleQuery3 (row) {
        this.videoTitle = '审批日志'
        this.visible = true
        this.visible2 = false
        this.visible1 = false
        this.visible3 = true
        const businessId = row.id
        getAuditLog(businessId).then(response => {
          this.list1 = response.data
        })
      },
      /** 查询字典列表 */
      getList () {
        this.loading = true
        listVideo(this.queryParam).then(response => {
            this.list = response.data.records
            this.total = response.data.total - 0
            this.loading = false
          }
        )
      },
      handleQuery1 (row) {
        this.visible = true
        this.visible1 = true
        this.visible2 = false
        const id = row.id
        getVideo(id).then(response => {
          this.videoUrl = response.data.url
          this.videoTitle = response.data.title
        })
      },
      handleQuery2 (row) {
        this.visible = true
        this.visible2 = true
        this.visible1 = false
        this.videoTitle = '流程图'
        this.diagramUrl = process.env.VUE_APP_BASE_API + '/admin/sys/resource/video/api/diagram?processInstanceId=' + row.processInstanceId + '&Authorization=Bearer ' + storage.get(ACCESS_TOKEN)
      },
      /** 搜索按钮操作 */
      handleQuery () {
        this.queryParam.pageNum = 1
        this.getList()
      },
      statusFormat (res) {
        if (res.status === 0) {
          return '待审批'
        } else if (res.status === 1) {
          return '审批中'
        } else if (res.status === 2) {
          return '审批拒绝'
        }
        return '审批通过'
      },
      /** 重置按钮操作 */
      resetQuery () {
        this.dateRange = []
        this.queryParam = {
          pageNum: 1,
          pageSize: 10,
          title: undefined,
          code: 'video',
          id: ''
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
          content: '当前选中视频编号为' + id + '的数据',
          onOk () {
            return delVideo(id)
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
