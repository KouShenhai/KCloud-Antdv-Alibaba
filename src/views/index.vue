<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="avatar"/>
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ name }}<span class="welcome-text"></span>
          </div>
          <div style="margin: 0;padding: 0;">
            <iframe
              scrolling="no"
              src="https://tianqiapi.com/api.php?style=tq&skin=baidu&align=left"
              frameborder="0"
              width="100%"
              height="20"
              allowtransparency="true"></iframe>
          </div>
        </div>
      </div>
    </template>
    <div>
      <a-row :gutter="24">
        <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            :bordered="true"
            title="系统架构图"
            :body-style="{ padding: 0 }">
            <img src="../../public/老寇云平台架构图-阿里巴巴.png" style="width: 100%;height: 100%;"/></a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>
<script>
import { timeFix } from '@/utils/util'
import { mapGetters } from 'vuex'
import { PageHeaderWrapper } from '@/components/ProLayout'
export default {
  name: 'Index',
  components: {
    PageHeaderWrapper
  },
  data () {
    return {
      timeFix: timeFix(),
      refreshTime: ''
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'name'
    ]),
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
  created () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  @import "./index.less";
  blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
  }
  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }

    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 66px;
      line-height: 22px;
      overflow: hidden;
    }

    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;

      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }

      .download {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }

    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }
  .v-note-wrapper{ z-index:1 !important; }
</style>
