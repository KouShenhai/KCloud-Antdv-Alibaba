<template>
  <div class="table-page-search-wrapper">
    <div v-hasPermi="['sys:search:resource:query']" >
      <a-input v-model="keyword" v-on:keyup.enter="searchResource()" placeholder="请输入搜索内容" allow-clear >
        <a-icon slot="prefix" type="search" :style="{ color: 'rgba(0,0,0,.25)' }"/>
      </a-input>
    </div>
    <br/>
    <div v-if="list.length > 0">
      <span style="font-size: 14px;font-weight: bolder;">搜索 <span style='color:red;'>{{searchWord}}</span> 找到 <span style='color:red;'>{{total}}</span> 个相关内容</span>
    </div><br/>
    <div v-for="(item, i) in list" :key="i">
      <div style="font-size: 14px;font-weight: bolder;" v-html="item.title"/>
      <span style="font-size: 14px;" v-html="item.remark"/>
      <router-link style="color: dodgerblue;" v-if="item.code == 'audio'" :to="{name: 'sysresourceaudioview', query: {id: item.id}}">查看详情</router-link>
      <router-link style="color: dodgerblue" v-if="item.code == 'image'" :to="{name: 'sysresourceimageview', query: {id: item.id}}">查看详情</router-link>
      <router-link style="color: dodgerblue" v-if="item.code == 'video'" :to="{name: 'sysresourcevideoview', query: {id: item.id}}">查看详情</router-link>
      <br/>
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
          total: "",
          searchWord: "",
          form: {
            pageNum: 1,
            pageSize: 10000,
            needPage: false,
            orSearchList:[],
            highlightFieldList: ["title","remark"],
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
            this.searchWord = this.keyword
            this.form.queryStringList = []
            this.form.queryStringList.push({field: "remark", value: this.keyword});
            this.form.queryStringList.push({field: "title", value: this.keyword});
            searchResource(this.form).then(response => {
                this.list = response.data == null ? [] : response.data.records
                this.total = response.data == null ? 0 : response.data.total - 0
              }
            )
          }
      }
    }
</script>

<style lang="less" scoped>

</style>