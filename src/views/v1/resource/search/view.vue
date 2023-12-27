<template>
  <div class="table-page-search-wrapper">
    <div v-hasPermi="['resource:search']" >
      <a-input v-model="keyword" @keyup.enter="searchResource()" placeholder="请输入搜索内容" allow-clear >
        <a-icon slot="prefix" type="search" :style="{ color: 'rgba(0,0,0,.25)' }"/>
      </a-input>
    </div>
    <br/>
    <div v-if="searchWord !== ''">
      <span style="font-size: 14px;font-weight: bolder;">搜索 <span style="color:red;">{{ searchWord }}</span> 找到 <span style="color:red;">{{ total }}</span> 个相关内容</span>
    </div><br/>
    <div v-for="(item, i) in list" :key="i">
      <div style="font-size: 14px;font-weight: bolder;" v-html="item.title"/>
      <span style="font-size: 14px;" v-html="item.remark"/>
      <router-link style="color: dodgerblue;" :to="{name: 'resourceheaven-view', query: {id: item.id}}"> 查看详情</router-link>
      <br/>
      <br/>
    </div>
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
  </div>
</template>
<script>
  import { searchResource } from '@/api/v1/resource'
    export default {
        name: 'SearchResource',
      data () {
        return {
          keyword: '',
          total: 0,
          searchWord: '',
          form: {
            pageNum: 1,
            pageSize: 10,
            orQueryList: [],
            highlightFieldList: ['title', 'remark'],
            queryStringList: [],
            indexNames: ['laokou_resource']
          },
          list: [],
          queryParam: {
            pageNum: 1,
            pageSize: 10
          }
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
        searchResource () {
          const keyword = this.keyword
          if (keyword == null || keyword === '' || keyword === undefined) {
            this.$message.error(
              '请输入关键字',
              3
            )
            return
          }
          this.form.pageSize = this.queryParam.pageSize
          this.form.pageNum = this.queryParam.pageNum
          this.form.queryStringList = []
          this.form.queryStringList.push({ field: 'remark', value: this.keyword })
          this.form.queryStringList.push({ field: 'title', value: this.keyword })
          const data = { search: this.form }
          searchResource(data).then(response => {
              this.searchWord = keyword
              this.list = response.data == null ? [] : response.data.records
              this.total = response.data == null ? 0 : response.data.total - 0
            }
          )
        },
        changeSize (current, pageSize) {
          this.queryParam.pageNum = current
          this.queryParam.pageSize = pageSize
          this.searchResource()
        },
        onShowSizeChange (current, pageSize) {
          this.queryParam.pageSize = pageSize
          this.searchResource()
        }
      }
    }
</script>

<style lang="less" scoped>

</style>
