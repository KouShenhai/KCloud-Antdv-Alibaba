<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="avatar"/>
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ nickname }}<span class="welcome-text"></span>
          </div>
          <span v-for="(w, index) in roles" :key="index">{{ w.name }}<a-divider type="vertical" v-if="index != roles.length - 1"/></span>
        </div>
      </div>
    </template>
    <div>
      <a-row :gutter="24">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            :bordered="true"
            title="项目简介"
            :body-style="{ padding: 0 }">
          <mavon-editor
            class="md"
            :value="content1"
            :ishljs="true"
            :subfield="prop.subfield"
            :defaultOpen="prop.defaultOpen"
            :toolbarsFlag="prop.toolbarsFlag"
            :editable="prop.editable"
            :scrollStyle="prop.scrollStyle"/>
          </a-card>
        </a-col>
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            :bordered="true"
            title="更新日志"
            :body-style="{ padding: 0 }">
          <mavon-editor
            class="md"
            :value="content2"
            :ishljs="true"
            :subfield="prop.subfield"
            :defaultOpen="prop.defaultOpen"
            :toolbarsFlag="prop.toolbarsFlag"
            :editable="prop.editable"
            :scrollStyle="prop.scrollStyle"/>
          </a-card>
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
      roleNames:[],
      timeFix: timeFix(),
      content2: '### 2022.07.28 更新日志\n' +
        '###### 1.更新组件\n' +
        '* 数据权限 => 拦截角色下的部门\n' +
        '\n' +
        '### 2022.07.27 更新日志\n' +
        '###### 1.新增功能\n' +
        '* 部门管理\n' +
        '\n' +
        '### 2022.07.25 更新日志\n' +
        '###### 1.动态路由\n' +
        'gateway + apollo\n' +
        '\n' +
        '### 2022.07.20 更新日志\n' +
        '###### 1.新增模块\n' +
        '* laokou-generator => 数据生成模块\n' +
        '\n' +
        '### 2022.07.19 更新日志\n' +
        '###### 1.打包插件\n' +
        '* maven-plus => 动态加载yml\n' +
        '\n' +
        '### 2022.07.18 更新日志\n' +
        '###### 1.增加模板\n' +
        '* laokou-security => 服务认证模块\n' +
        '\n' +
        '###### 2.其他组件\n' +
        '* Websocket\n' +
        '\n' +
        '### 2022.07.17 更新日志\n' +
        '###### 1.增加模板\n' +
        '* laokou-auth => 认证模块\n' +
        '\n' +
        '### 2022.07.16 更新日志\n' +
        '###### 1.增加组件\n' +
        '* 数据权限 => 拦截角色下的用户\n' +
        '\n' +
        '### 2022.07.14 更新日志\n' +
        '###### 1.增加组件\n' +
        '* 多数据源组件\n' +
        '\n' +
        '###### 2.部署脚本\n' +
        '* docker-compose.yml\n' +
        '\n' +
        '###### 3.持续交付\n' +
        '* Jenkins\n' +
        '\n' +
        '### 2022.07.12 更新日志\n' +
        '###### 1.版本升级\n' +
        '* SpringBoot 2.0.0 => SpringBoot 2.2.5\n' +
        '* SpringCloud Finchley.SR1 => SpringCloud Hoxton.SR6\n' +
        '* Swagger 2.8 => Knife4j 2.0.9\n' +
        '###### 2.对接服务\n' +
        '* SkyWalking\n' +
        '* Prometheus\n' +
        '\n' +
        '###### 3.项目部署\n' +
        '* Shell\n' +
        '* Docker\n' +
        '\n' +
        '###### 4.其他组件\n' +
        '* Flowable\n' +
        '* Jasypt\n' +
        '\n' +
        '###### 5.版本管理\n' +
        '* laokou-parent => 统一管理maven版本\n' +
        '\n' +
        '### 2022.06.15 更新日志\n' +
        '###### 1.架构升级\n' +
        '* MVC <=> 三层架构 => 四层架构 <=> DDD\n' +
        '* 集中式架构 => 分布式微服务架构\n',
      content1: '### 项目备注\n' +
        '* 项目：KCloud-Platform\n' +
        '* 作者：老寇\n' +
        '* 语言：Java\n' +
        '* 职位：Java工程师\n' +
        '* 时间：2020.06.08 ~ 至今\n' +
        '\n' +
        '### 项目介绍\n' +
        '老寇云，是基于SpringCloud开发，面向Java编程的学习者，用于技术进阶，技术知识体系架构的构建，用生动的代码来感受技术的魅力。\n' +
        '\n' +
        '使用的中间件有redis\n' +
        '\n' +
        '...\n' +
        '\n' +
        '...\n' +
        '\n' +
        '...\n' +
        '\n' +
        '### 功能介绍\n' +
        '* 用户管理\n' +
        '* 角色管理\n' +
        '* 菜单管理\n' +
        '* 部门管理\n' +
        '* 日志管理\n' +
        '* 字典管理\n' +
        '* 消息管理\n' +
        '* 流程定义\n' +
        '* 流程任务\n' +
        '* 接口文档\n' +
        '* 数据监控\n' +
        '* 服务监控\n' +
        '* 主机监控\n' +
        '\n' +
        '### 系统架构\n' +
        '![](http://assets.processon.com/chart_image/62e2406b1e0853070694817f.png)\n' +
        '\n' +
        '### 技术体系\n' +
        '\n' +
        '#### 四层架构\n' +
        '* application <=> 应用层\n' +
        '* domain <=> 领域层\n' +
        '* infrastructure <=> 基础层\n' +
        '* interfaces <=> 表现层\n' +
        '\n' +
        '#### 基础框架\n' +
        '* Shiro\n' +
        '* SpringBoot\n' +
        '* SpringCloud Netflix\n' +
        '\n' +
        '#### 技术栈\n' +
        '* mysql\n' +
        '* redis\n' +
        '* mybatis-plus\n' +
        '* apollo\n' +
        '\n' +
        '#### 一键部署\n' +
        '* docker-compose\n' +
        '\n' +
        '#### 持续交付\n' +
        '* jenkins\n' +
        '\n' +
        '#### 项目结构\n' +
        '~~~\n' +
        '├── laokou-base\n' +
        '        └── laokou-common -- 公共组件\n' +
        '        └── laokou-dynamic-datasource 多数据源组件\n' +
        '        └── laokou-log -- 日志组件\n' +
        '        └── laokou-security -- 认证组件\n' +
        '├── laokou-cloud\n' +
        '        └── laokou-gateway -- API网关\n' +
        '        └── laokou-monitor -- 服务监控\n' +
        '        └── laokou-register -- 服务治理\n' +
        '├── laokou-parent -- 版本依赖\n' +
        '├── laokou-service\n' +
        '        └── laokou-admin -- 后台管理模块\n' +
        '        └── laokou-auth -- 认证模块\n' +
        '        └── laokou-generator -- 数据生成模块\n' +
        '        └── laokou-redis -- 缓存模块\n' +
        '~~~\n' +
        '\n' +
        '### 项目配置\n' +
        '* 安装jdk1.8、mysql5.7、redis、apollo\n' +
        '* 创建数据库\n' +
        '* 开启apr模式\n' +
        '* 修改第三方相关配置\n' +
        '* 修改中间件相关配置\n' +
        '\n' +
        '```yaml\n' +
        '  # mysql\n' +
        '  datasource:\n' +
        '    druid:\n' +
        '      # 连接地址\n' +
        '      url: jdbc:mysql://127.0.0.1:3306/kcloud?allowMultiQueries=true&useUnicode=true&characterEncoding=UTF-8&useSSL=false\n' +
        '      # 用户名\n' +
        '      username: root\n' +
        '      # 密码\n' +
        '      password: XXXXXX\n' +
        '  # redis\n' +
        '  redis:\n' +
        '    #数据库索引\n' +
        '    database: 0\n' +
        '    #主机\n' +
        '    host: 127.0.0.1\n' +
        '    #端口\n' +
        '    port: 6379\n' +
        '    #连接超时时长（毫秒）\n' +
        '    timeout: 6000ms \n' +
        '```\n' +
        '\n' +
        '### 多数据源配置\n' +
        '##### 代码引入\n' +
        '```java\n' +
        '@Service\n' +
        '@Transactional(rollbackFor = Exception.class,propagation = Propagation.REQUIRES_NEW)\n' +
        'public class SysUserApplicationServiceImpl implements SysUserApplicationService {\n' +
        '\n' +
        '    @Autowired\n' +
        '    private SysUserService sysUserService;\n' +
        '\n' +
        '    @Override\n' +
        '    @DataSource("master")\n' +
        '    public IPage<SysUserVO> queryUserPage(SysUserQO qo) {\n' +
        '        IPage<SysUserVO> page = new Page<>(qo.getPageNum(),qo.getPageSize());\n' +
        '        return sysUserService.getUserPage(page,qo);\n' +
        '    }\n' +
        '}\n' +
        '```\n' +
        '##### 配置文件\n' +
        '```yaml\n' +
        'dynamic:\n' +
        '  datasource:\n' +
        '    slave:\n' +
        '      driver-class-name: com.mysql.jdbc.Driver\n' +
        '      url: jdbc:mysql://127.0.0.1:3306/kcloud?useUnicode=true&characterEncoding=UTF-8&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=Asia/Shanghai&useSSL=false\n' +
        '      username: root\n' +
        '      password: 123456\n' +
        '```\n' +
        '\n' +
        '### 数据权限\n' +
        '##### 代码引入\n' +
        '```java\n' +
        '@Service\n' +
        '@Transactional(rollbackFor = Exception.class,propagation = Propagation.REQUIRES_NEW)\n' +
        'public class SysUserApplicationServiceImpl implements SysUserApplicationService {\n' +
        '\n' +
        '    @Autowired\n' +
        '    private SysUserService sysUserService;\n' +
        '\n' +
        '    @Override\n' +
        '    @DataFilter(tableAlias = "boot_sys_user")\n' +
        '    public IPage<SysUserVO> queryUserPage(SysUserQO qo) {\n' +
        '        IPage<SysUserVO> page = new Page<>(qo.getPageNum(),qo.getPageSize());\n' +
        '        return sysUserService.getUserPage(page,qo);\n' +
        '    }\n' +
        '}\n' +
        '```\n' +
        '##### 配置文件\n' +
        '```xml\n' +
        '<if test="qo.sqlFilter != null and qo.sqlFilter != \'\'">\n' +
        '    and ( ${qo.sqlFilter} )\n' +
        '</if>\n' +
        '```\n' +
        '\n' +
        '### 服务认证\n' +
        '##### 代码引入\n' +
        '说明：@PreAuthorize 根据请求头携带的ticket判断，ticket有值且等于ticket，则说明已经在网关认证过了直接跳过，否则需要认证\n' +
        '```java\n' +
        '@RestController\n' +
        '@AllArgsConstructor\n' +
        '@Api(value = "系统用户API",protocols = "http",tags = "系统用户API")\n' +
        '@RequestMapping("/sys/user/api")\n' +
        'public class SysUserApiController {\n' +
        '\n' +
        '    private final SysUserApplicationService sysUserApplicationService;\n' +
        '\n' +
        '    @PostMapping("/query")\n' +
        '    @ApiOperation("系统用户>查询")\n' +
        '    @PreAuthorize("sys:user:query")\n' +
        '    public HttpResultUtil<IPage<SysUserVO>> query(@RequestBody SysUserQO qo) {\n' +
        '        return new HttpResultUtil<IPage<SysUserVO>>().ok(sysUserApplicationService.queryUserPage(qo));\n' +
        '    }\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '### 演示地址\n' +
        '[http://175.178.69.253](http://175.178.69.253)\n' +
        '* admin/admin123\n' +
        '* test/test123\n' +
        '* laok5/test123\n' +
        '\n' +
        '### 项目说明\n' +
        '* 代码不可商用及二次开源，仅供学习使用\n' +
        '* 代码不可商用及二次开源，仅供学习使用\n' +
        '* 代码不可商用及二次开源，仅供学习使用\n' +
        '\n' +
        '### 参与贡献\n' +
        '欢迎各路英雄好汉参与KCloud-Platform代码贡献，期待您的加入！Fork本仓库 新建Feat_xxx分支提交代码，新建Pull Request\n' +
        '\n' +
        '### 加入仓库\n' +
        '[https://gitee.com/laokou-yun?invite=af23e9108ac2450f324a37ebfde7364432d403c8ff96ab388e7cde0b62298f89d0f128ae41c0fbdba3913bda53efc7e3e6616f3d00909d16](https://gitee.com/laokou-yun?invite=af23e9108ac2450f324a37ebfde7364432d403c8ff96ab388e7cde0b62298f89d0f128ae41c0fbdba3913bda53efc7e3e6616f3d00909d16)\n' +
        '\n' +
        '### 开源协议\n' +
        'KCloud-Platform 开源软件遵循 [Apache 2.0 协议](https://www.apache.org/licenses/LICENSE-2.0.html)\n' +
        '务必保留作者、Copyright信息\n' +
        '![](https://minio.pigx.vip/oss/1655474288.jpg)\n' +
        '\n' +
        '### 致谢\n' +
        '* [人人社区](https://www.renren.io)\n' +
        '* [若依社区](http://www.ruoyi.vip)\n' +
        '\n' +
        '### 联系\n' +
        '后端技术交流群 [![加入QQ群](https://img.shields.io/badge/Q群-218686225-blue.svg)](https://qm.qq.com/cgi-bin/qm/qr?k=WFANTXDEjrDw6UxsrRFCv_rQsEu6LTxH&jump_from=webapi)\n'
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'nickname',
      'roles'
    ]),
    prop() {
      return {
        subfield: false, // 单双栏模式
        defaultOpen: "preview", //edit： 默认展示编辑区域 ， preview： 默认展示预览区域
        editable: false,
        toolbarsFlag: false,
        scrollStyle: true,
      }
    }
  },
  created () {

  },
  mounted () {
  },
  methods: {
    onSponsorTabChange (key, type) {
      this[type] = key
    },
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
