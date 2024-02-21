<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" v-hasPermi="['resource:list']">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="资源编号">
                <a-input v-model="queryParam.id" placeholder="请输入资源编号" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="资源名称">
                <a-input v-model="queryParam.title" placeholder="请输入资源名称" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select placeholder="审批状态" v-model="queryParam.status" style="width: 100%" allow-clear>
                  <a-select-option v-for="(d, index) in statusOptions" :key="index" :value="d.value">{{ d.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="类型">
                <a-select placeholder="资源类型" v-model="queryParam.code" style="width: 100%" allow-clear>
                  <a-select-option v-for="(d, index) in codeOptions" :key="index" :value="d.value">{{ d.label }}</a-select-option>
                </a-select>
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
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPermi="['resource:create']">
          <a-icon type="plus" />新增
        </a-button>
        <a-button :loading="syncLoading" type="danger" @click="syncIndex()" v-hasPermi="['resource:sync']">
          <a-icon type="sync" /> 同步
        </a-button>
      </div>
      <!-- 增加修改 -->
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
        <span slot="status" slot-scope="text, record">
          {{ statusFormat(record) }}
        </span>
        <span slot="code" slot-scope="text, record">
          {{ codeFormat(record) }}
        </span>
        <span slot="operation" slot-scope="text, record" >
          <a @click="$refs.createForm.handleAdd()" v-hasPermi="['resource:create']">
            <a-icon type="plus" />新增
          </a>
          <a-divider type="vertical" v-hasPermi="['resource:modify']" v-if="record.status == 2 || record.status == -1"/>
          <a v-hasPermi="['resource:modify']" @click="$refs.createForm.handleUpdate(record, undefined)" v-if="record.status == 2 || record.status == -1">
            <a-icon type="edit" />修改
          </a>
          <a-divider type="vertical" v-if="record.status == 2 || record.status == -1" v-hasPermi="['resource:detail']"/>
          <a @click="handleQuery1(record)" v-if="record.status == 2 || record.status == -1" v-hasPermi="['resource:detail']">
            <a-icon type="eye" />查看
          </a>
          <a-divider type="vertical" v-if="record.status == 2 || record.status == -1" v-hasPermi="['resource:download']"/>
          <a @click="download(record)" v-if="record.status == 2 || record.status == -1" v-hasPermi="['resource:download']">
            <a-icon type="download" />下载
          </a>
          <a-divider type="vertical" v-if="record.status != 2 && record.status != -1" v-hasPermi="['resource:diagram']"/>
          <a @click="handleQuery2(record)" v-if="record.status != 2 && record.status != -1" v-hasPermi="['resource:diagram']">
            <a-icon type="gold" />查看
          </a>
          <a-divider type="vertical" v-hasPermi="['resource:audit-log']"/>
          <a @click="handleQuery3(record)" v-hasPermi="['resource:audit-log']">
            <a-icon type="file" />审批日志
          </a>
          <a-divider type="vertical" v-if="record.status == 2 || record.status == -1" v-hasPermi="['resource:remove']"/>
          <a @click="handleDelete(record)" v-if="record.status == 2 || record.status == -1" v-hasPermi="['resource:remove']">
            <a-icon type="delete" />删除
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
    </a-card>
    <a-modal
      ref="noticeDetail"
      :width="900"
      :visible="visible"
      @cancel="close"
      :footer="null">
      <template slot="title" >
        <center><a-tag color="blue">{{ resourceType }}</a-tag>{{ resourceTitle }}</center>
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
      <img v-show="visible1" :src="resourceUrl" style="width: 100%;height: 100%">
      <audio v-show="visible4" loop="loop" :src="resourceUrl" controls="controls"><object :data="resourceUrl" ><embed :src="resourceUrl" /></object></audio>
      <video
        v-show="visible5"
        :src="resourceUrl"
        loop="loop"
        width="200"
        height="100"
        controls="controls"><source :src="resourceUrl" type="video/mp4"><object :data="resourceUrl" width="200" height="100"><embed :src="resourceUrl" width="200" height="100" /></object></video>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import {
  listResource,
  getResourceById,
  getResourceAuditLogById,
  syncResourceIndex,
  getResourceDiagram,
  downloadResource,
  deleteResourceById
} from '@/api/v1/resource'
  import CreateForm from '../modules/CreateForm.vue'
  import { tableMixin } from '@/store/table-mixin'
  import moment from 'moment'
  export default {
    name: 'Resource',
    components: {
      CreateForm
    },
    mixins: [tableMixin],
    data () {
      return {
        diagramUrl: '',
        resourceTitle: '',
        resourceUrl: '',
        resourceType: '',
        list: [],
        visible1: false,
        visible2: false,
        visible3: false,
        visible4: false,
        visible5: false,
        syncLoading: false,
        loading: false,
        total: 0,
        visible: false,
        queryParam: {
          pageNum: 1,
          pageSize: 10,
          title: undefined,
          code: '',
          status: '',
          id: ''
        },
        codeOptions: [
          {
            label: '音频', value: 'audio'
          },
          {
            label: '视频', value: 'video'
          },
          {
            label: '图片', value: 'image'
          }
        ],
        statusOptions: [
          {
            label: '待审批', value: 0
          },
          {
            label: '审批中', value: 1
          },
          {
            label: '驳回审批', value: -1
          },
          {
            label: '通过审批', value: 2
          }
        ],
        columns: [
          {
            title: '标题',
            dataIndex: 'title',
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
            title: '类型',
            dataIndex: 'code',
            ellipsis: true,
            scopedSlots: { customRender: 'code' },
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
            width: '31%',
            scopedSlots: { customRender: 'operation' },
            align: 'center'
          }
        ],
          columns1: [
          {
            title: '审核人',
            dataIndex: 'approver',
            ellipsis: true,
            align: 'center'
          },
          {
            title: '审核时间',
            dataIndex: 'createDate',
            ellipsis: true,
            align: 'center'
          },
          {
            title: '审核意见',
            dataIndex: 'comment',
            ellipsis: true,
            align: 'center'
          },
          {
            title: '审核状态',
            dataIndex: 'status',
            ellipsis: true,
            scopedSlots: { customRender: 'auditStatus' },
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
      download (row) {
        this.loading = true
        const title = row.title
        const suffix = title.slice(title.lastIndexOf('.'))
        downloadResource(row.id).then(res => {
          const url = window.URL.createObjectURL(res) // 创建下载链接
          const link = document.createElement('a') // 赋值给a标签的href属性
          link.style.display = 'none'
          link.download = moment(new Date()).format('YYYYMMDDHHmmss') + suffix
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
      linkQuery () {
        const query = this.$route.query
        if (JSON.stringify(query) !== '{}') {
          this.queryParam.id = query.id
        }
        this.getList()
      },
      syncIndex () {
        const that = this
        that.syncLoading = true
        syncResourceIndex().then(() => {
          that.$message.success(
            '索引同步成功',
            3
          )
        }).finally(() => {
          that.syncLoading = false
        })
      },
      handleQuery3 (row) {
        this.resetQuery2()
        this.resourceTitle = '审批日志'
        this.resourceType = row.code === 'audio' ? '音频' : (row.code === 'video' ? '视频' : '图片')
        this.visible = true
        this.visible2 = false
        this.visible1 = false
        this.visible3 = true
        this.visible4 = false
        this.visible5 = false
        getResourceAuditLogById(row.id).then(response => {
          this.list1 = response.data
        })
      },
      // 关闭模态框
      close () {
        this.visible = false
        this.diagramUrl = ''
        this.resourceUrl = ''
        this.resourceTitle = ''
        this.resourceType = ''
        this.list1 = []
        this.visible3 = false
        this.visible1 = false
        this.visible2 = false
        this.visible4 = false
        this.visible5 = false
      },
      /** 查询字典列表 */
      getList () {
        this.loading = true
        listResource(this.queryParam).then(response => {
            this.list = response.data.records
            this.total = response.data.total - 0
            this.loading = false
          }
        )
      },
      handleQuery1 (row) {
        this.visible = true
        this.visible2 = false
        this.visible3 = false
        const id = row.id
        getResourceById(id).then(response => {
          this.resourceUrl = response.data.url
          this.resourceTitle = response.data.title
          const code = response.data.code
          if (code === 'video') {
            this.resourceType = '视频'
            this.visible1 = false
            this.visible5 = true
            this.visible4 = false
          }
          if (code === 'audio') {
            this.resourceType = '音频'
            this.visible1 = false
            this.visible5 = false
            this.visible4 = true
          }
          if (code === 'image') {
            this.resourceType = '图片'
            this.visible1 = true
            this.visible5 = false
            this.visible4 = false
          }
        })
      },
      auditStatusFormat (res) {
        if (res.status === 0) {
          return '审批驳回'
        } else if (res.status === 1) {
          return '审批通过'
        }
      },
      handleQuery2 (row) {
        this.visible = true
        this.visible2 = true
        this.visible1 = false
        this.resourceType = row.code === 'audio' ? '音频' : (row.code === 'video' ? '视频' : '图片')
        this.resourceTitle = '查看流程'
        getResourceDiagram(row.instanceId).then(res => {
          this.diagramUrl = 'data:image/png;base64,' + res.data
        })
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
        } else if (res.status === -1) {
          return '驳回审批'
        }
        return '通过审批'
      },
      codeFormat (res) {
        if (res.code === 'audio') {
          return '音频'
        } else if (res.code === 'video') {
          return '视频'
        } else if (res.code === 'image') {
          return '图片'
        }
        return '未知'
      },
      /** 重置按钮操作 */
      resetQuery () {
        this.queryParam = {
          pageNum: 1,
          pageSize: 10,
          title: undefined,
          code: '',
          status: '',
          id: ''
        }
        this.handleQuery()
      },
      /** 重置按钮操作 */
      resetQuery2 () {
        this.queryParam2 = {
          pageNum: 1,
          pageSize: 10,
          id: ''
        }
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
          content: '当前选中资源编号为' + id + '的数据',
          onOk () {
            return deleteResourceById(id)
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
