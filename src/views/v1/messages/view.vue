<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper" v-hasPermi="['messages:list']">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="标题">
                <a-input v-model="queryParam.title" placeholder="请输入" allow-clear/>
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
        <a-button type="primary" @click="handleAdd()" v-hasPermi="['messages:create']">
          <a-icon type="plus" />新增
        </a-button>
        <table-setting
          :style="{float: 'right'}"
          :table-size.sync="tableSize"
          v-model="columns"
          :refresh-loading="loading"
          @refresh="getList" />
      </div>
      <!-- 数据展示 -->
      <a-table
        :loading="loading"
        :size="tableSize"
        rowKey="id"
        :columns="columns"
        :data-source="list"
        :pagination="false"
        :bordered="tableBordered">
        <span slot="type" slot-scope="text, record">
          {{ typeFormat(record) }}
        </span>
        <span slot="operation" slot-scope="text, record">
          <a @click="handleAdd()" v-hasPermi="['messages:create']">
            <a-icon type="plus" />
            新增
          </a>
          <a-divider type="vertical" v-hasPermi="['messages:detail']"/>
          <a @click="getMessage(record)" v-hasPermi="['messages:detail']">
            <a-icon type="eye" />
            查看
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
        <center><a-tag color="blue">平台</a-tag>{{ form.title }}</center>
      </template>
      <mavon-editor
        class="md"
        :value="form.content"
        :ishljs="true"
        :subfield="prop.subfield"
        :defaultOpen="prop.defaultOpen"
        :toolbarsFlag="prop.toolbarsFlag"
        :editable="prop.editable"
        :scrollStyle="prop.scrollStyle"/>
    </a-modal>
  </page-header-wrapper>
</template>

<script>

import { listMessage, getMessageById } from '@/api/v1/message'
import { tableMixin } from '@/store/table-mixin'
export default {
  name: 'Notice',
  components: {
  },
  mixins: [tableMixin],
  data () {
    return {
      visible: false,
      list: [],
      loading: false,
      total: 0,
      form: {
        title: '',
        content: ''
      },
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        title: undefined
      },
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
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
          width: '15%',
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
    prop () {
      return {
        subfield: false, // 单双栏模式
        defaultOpen: 'preview', // edit： 默认展示编辑区域 ， preview： 默认展示预览区域
        editable: false,
        toolbarsFlag: false,
        scrollStyle: true
      }
    }
  },
  watch: {
  },
  methods: {
    getMessage (row) {
      getMessageById(row.id).then(response => {
        this.form.content = response.data.content
        this.form.title = response.data.title
        this.visible = true
      })
    },
    // 关闭模态框
    close () {
      this.visible = false
      this.form.title = ''
      this.form.content = ''
    },
    /** 查询公告列表 */
    getList () {
      this.loading = true
      listMessage(this.queryParam).then(response => {
          this.list = response.data.records
          this.total = response.data.total - 0
          this.loading = false
        }
      )
    },
    typeFormat (row) {
      if (row.type === 1) {
        return '提醒'
      }
      return '通知'
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
        title: undefined
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
     /** 新增按钮操作 */
    handleAdd () {
      this.$router.push({
        name: 'NoticeForm',
        params:
        {
          id: undefined,
          formTitle: '新增消息'
        }
      })
    }
  }
}
</script>
