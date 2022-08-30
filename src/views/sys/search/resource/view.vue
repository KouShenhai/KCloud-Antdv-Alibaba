<template>
  <div class="table-page-search-wrapper">
    <div>
      <a-input v-model="keyword" v-on:keyup.enter="searchResource()" placeholder="请输入搜索内容" allow-clear >
        <a-icon slot="prefix" type="search" :style="{ color: 'rgba(0,0,0,.25)' }"/>
      </a-input>
    </div>
    <br/>
    <div v-for="(item, i) in list" :key="i">
      <div style="font-size: 14px;">{{item.title}}</div>
      <div style="font-size: 14px;font-weight: bolder;">{{item.remark}}</div>
      <br/>
    </div>
  </div>
</template>
<script>
  import { searchResource } from '@/api/sys/search'
    export default {
        name: "Search-Resource",
      data () {
        return {
          keyword: "",
          form: {
            pageNum: 1,
            pageSize: 10000,
            needPage: false,
            orSearchList:[],
            highlightFieldList: ["title","remark"],
            sortFieldList: [{field: "ym", value: "desc"}],
            queryStringList: [],
            indexNames: ["laokou_resource"]
          },
          // 致谢项目
          list: []
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
          searchResource() {
            this.form.queryStringList = []
            this.form.queryStringList.push({field: "remark", value: this.keyword});
            this.form.queryStringList.push({field: "title", value: this.keyword});
            searchResource(this.form).then(response => {
                this.list = response.data.records
              }
            )
          }
      }
    }
</script>

<style scoped>

</style>