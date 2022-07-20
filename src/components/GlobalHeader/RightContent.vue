<template>
  <div :class="wrpCls">
    <a-space size="middle">
      <screenfull />
      <notice-icon/>
      <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
      <!-- 暂只支持中文，国际化可自行扩展 -->
      <select-lang :class="prefixCls" />
    </a-space>
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import NoticeIcon from '@/components/NoticeIcon'
import Screenfull from '@/components/Screenfull'
import SelectLang from '@/components/SelectLang'
import {socketApi} from '@/api/sys/socket'
export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    NoticeIcon,
    Screenfull,
    SelectLang
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showMenu: true,
      currentUser: {}
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.currentUser = {
        name: 'LaoKou'
      }
    }, 1500)
    this.connectWebsocket();
  },
  methods: {
    connectWebsocket() {
      let websocket;
      if (typeof WebSocket === "undefined") {
        console.log("您的浏览器不支持WebSocket");
        return;
      } else {
        let userId = '1'
        let gateway = "192.168.62.1:5555"
        let protocol = "ws";
        let url = "";
        if (window.location.protocol === "https:") {
          protocol = "wss";
        }
        if (process.env.NODE_ENV === 'production') {
          gateway = '175.178.69.253:5555'
        }
        url = `${protocol}://` + gateway  + socketApi.URI + userId;
        // 打开一个websocket
        websocket = new WebSocket(url);
        // 建立连接
        websocket.onopen = () => {
          // 发送数据
          console.log("websocket建立连接");
        };
        // 客户端接收服务端返回的数据
        websocket.onmessage = evt => {
          console.log("websocket返回的数据：", evt);
        };
        // 发生错误时
        websocket.onerror = evt => {
          console.log("websocket错误：", evt);
        };
        // 关闭连接
        websocket.onclose = evt => {
          console.log("websocket关闭：", evt);
        };
      }
    }
  }
}
</script>
