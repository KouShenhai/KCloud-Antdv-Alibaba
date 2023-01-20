<template>
  <div>
    <a-popover
      v-model="visible"
      trigger="click"
      placement="bottomRight"
      overlayClassName="header-notice-wrapper"
      :getPopupContainer="() => $refs.noticeRef.parentElement"
      :autoAdjustOverflow="true"
      :arrowPointAtCenter="true"
      :overlayStyle="{ width: '200px', top: '50px' }"
    >
      <template slot="content">
        <a-spin :spinning="loading">
          <a-tabs v-model="queryParam.type" @change="changeType">
            <a-tab-pane v-for="d in typeOptions" :key="d.value" :tab="d.label">
              <a-list style="max-height: 200px; overflow:auto;">
                <div
                  v-if="showLoadingMore"
                  slot="loadMore"
                  :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                  <a-spin v-if="loadingMore" />
                  <a-button v-else @click="onLoadMore">
                    查看更多
                  </a-button>
                </div>
                <a-list-item v-for="(item, index) in list" :key="index">
                  <a-list-item-meta :description="item.createDate">
                    <a slot="title" @click="$refs.noticeDetail.getNotice(item)">
                      <ellipsis :length="16" tooltip>{{ item.title }}</ellipsis>
                    </a>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-tab-pane>
          </a-tabs>
        </a-spin>
      </template>
      <span @click="fetchNotice" class="header-notice" ref="noticeRef">
        <a-badge :count="count">
          <a-icon style="font-size: 20px;" type="bell" />
        </a-badge>
      </span>
    </a-popover>
    <notice-detail @ok="getUnReadCount" ref="noticeDetail" />
  </div>
</template>

<script>
import { listUnRead, unReadCount } from '@/api/sys/message'
import Ellipsis from '@/components/Ellipsis'
import NoticeDetail from './NoticeDetail'
import { socketApi } from '@/api/sys/socket'
import { mapGetters } from 'vuex'
export default {
  name: 'HeaderNotice',
  components: {
    Ellipsis,
    NoticeDetail
  },
  data () {
    return {
      count: 0,
      loading: false,
      loadingMore: false,
      showLoadingMore: true,
      visible: false,
      queryParam: {
        pageNum: 1,
        pageSize: 5,
        type: 0
      },
      list: [],
      typeOptions: [
        {
          label: '通知',
          value: 0
        },
        {
          label: '提醒',
          value: 1
        }]
    }
  },
  mounted () {
    this.getUnReadCount()
    this.connectWebsocket()
  },
  computed: {
  ...mapGetters([
      'id'
    ])
  },
  methods: {
    getList () {
      this.loading = true
      listUnRead(this.queryParam).then(response => {
          this.list = this.list.concat(response.data.records)
          this.total = response.data.total - 0
          if (this.total <= this.queryParam.pageNum * this.queryParam.pageSize) {
            this.showLoadingMore = false
          } else {
            this.showLoadingMore = true
          }
          this.loading = false
        }
      )
    },
    fetchNotice () {
      this.resetQuery()
      if (!this.visible) {
        this.getList()
      }
      this.visible = !this.visible
    },
    resetQuery () {
      this.queryParam = {
        pageNum: 1,
        pageSize: 5,
        type: 0
      }
      this.list = []
    },
    changeType (key) {
      this.resetQuery()
      this.queryParam.type = key
      this.getList()
    },
    onLoadMore () {
      this.loadingMore = true
      this.queryParam.pageNum++
      this.getList()
      this.loadingMore = false
    },
    getUnReadCount () {
      unReadCount().then(response => {
          this.count = response.data
        }
      )
    },
    connectWebsocket () {
      let websocket
      if (typeof WebSocket === 'undefined') {
        console.log('您的浏览器不支持WebSocket')
      } else {
        let gateway = '192.168.62.1:5555'
        let protocol = 'ws'
        let url = ''
        if (window.location.protocol === 'https:') {
          protocol = 'wss'
        }
        if (process.env.NODE_ENV === 'production') {
          gateway = '175.178.69.253:5555'
        }
        url = `${protocol}://` + gateway + socketApi.URI + this.id
        // 打开一个websocket
        websocket = new WebSocket(url)
        // 建立连接
        websocket.onopen = () => {
          // 发送数据
          console.log('websocket建立连接')
        }
        // 客户端接收服务端返回的数据
        websocket.onmessage = evt => {
          // 动态更新通知数
          this.$notification.success({
            message: '提示',
            description: evt.data
          })
          this.getUnReadCount()
        }
        // 发生错误时
        websocket.onerror = evt => {
          console.log('websocket错误：', evt)
        }
        // 关闭连接
        websocket.onclose = evt => {
          console.log('websocket关闭：', evt)
        }
      }
    }
  }
}
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>
