<template>
  <a-card :bordered="false">
  <div class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          <a-input v-model="keyword" placeholder="请输入搜索内容" allow-clear >
            <a-icon slot="prefix" type="search" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-col>
      </a-row>
    </a-form>
  </div><br/>

    <div>11111111111</div>
    <div>333333333</div>
    <div>55555</div>
    <div>777777777</div><br/>

    <div>11111111111</div>
    <div>333333333</div>
    <div>55555</div>
    <div>777777777</div><br/>

    <div>11111111111</div>
    <div>333333333</div>
    <div>55555</div>
    <div>777777777</div><br/>

    <div>11111111111</div>
    <div>333333333</div>
    <div>55555</div>
    <div>777777777</div><br/>

    <div>11111111111</div>
    <div>333333333</div>
    <div>55555</div>
    <div>777777777</div><br/>

    <div>11111111111</div>
    <div>333333333</div>
    <div>55555</div>
    <div>777777777</div><br/>

  </a-card>
</template>

<script>
    export default {
        name: "Search-Resource",
      data () {
        return {
          keyword: ""
        }
      }
    }
</script>

<style scoped>

</style>