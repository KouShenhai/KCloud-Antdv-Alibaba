<template>
  <div class="table-page-search-wrapper">
    <div v-hasPermi="['sys:search:resource:query']" >
      <a-input v-model="keyword" v-on:keyup.enter="searchResource()" placeholder="请输入搜索内容" allow-clear >
        <a-icon slot="prefix" type="search" :style="{ color: 'rgba(0,0,0,.25)' }"/>
      </a-input>
    </div>
    <br/>
    <div v-for="(item, i) in list" :key="i">
      <div style="font-size: 14px;font-weight: bolder;" v-html="item.title"/>
      <span style="font-size: 14px;" v-html="item.remark"/>
      <router-link style="color: dodgerblue;" v-if="item.code == 'audio'" :to="{name: 'Resource-Audio', query: {id: item.id}}">查看详情</router-link>
      <router-link style="color: dodgerblue" v-if="item.code == 'image'" :to="{name: 'Resource-Image', query: {id: item.id}}">查看详情</router-link>
      <router-link style="color: dodgerblue" v-if="item.code == 'video'" :to="{name: 'Resource-Video', query: {id: item.id}}">查看详情</router-link>
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
            this.form.queryStringList = []
            this.form.queryStringList.push({field: "remark", value: this.keyword});
            this.form.queryStringList.push({field: "title", value: this.keyword});
            searchResource(this.form).then(response => {
                this.list = response.data == null ? [] : response.data.records
              }
            )
          }
      }
    }
</script>

<style lang="less" scoped>

</style>