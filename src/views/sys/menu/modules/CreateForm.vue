<template>
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="上级菜单" prop="pid">
        <a-tree-select
          v-model="form.pid"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="menuOptions"
          placeholder="请选择"
          :replaceFields="{children:'children', title:'name', key:'id', value: 'id' }"
          tree-default-expand-all
        >
        </a-tree-select>
      </a-form-model-item>
      <a-form-model-item label="菜单类型" prop="type">
        <a-radio-group v-model="form.type" button-style="solid">
          <a-radio-button value="0">菜单</a-radio-button>
          <a-radio-button value="1">按钮</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="请求方式" prop="method">
        <a-radio-group v-model="form.method" button-style="solid">
          <a-radio-button value="GET">GET</a-radio-button>
          <a-radio-button value="POST">POST</a-radio-button>
          <a-radio-button value="PUT">PUT</a-radio-button>
          <a-radio-button value="DELETE">DELETE</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="认证等级" prop="authLevel">
        <a-radio-group v-model="form.authLevel" button-style="solid">
          <a-radio-button value="0">权限认证</a-radio-button>
          <a-radio-button value="1">登录认证</a-radio-button>
          <a-radio-button value="2">无需认证</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="菜单图标" prop="icon">
        <a-space size="large">
          <a-icon :component="allIcon[form.icon + 'Icon']" v-if="form.icon && allIcon[form.icon + 'Icon']"/>
          <a-icon :type="form.icon" v-if="form.icon && !allIcon[form.icon + 'Icon']"/>
          <a-button type="dashed" @click="selectIcon">
            选择图标
          </a-button>
          <a @click="cancelSelectIcon" v-if="iconVisible" style="margin-left: 8px">
            收起
            <a-icon type="up"/>
          </a>
        </a-space>
      </a-form-model-item>
      <a-card :body-style="{padding: '10px 20px'}" :bordered="false" v-if="iconVisible">
        <icon-selector v-model="form.icon" @change="handleIconChange" :svgIcons="iconList" :allIcon="allIcon"/>
      </a-card>
      <a-form-model-item label="菜单名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="菜单排序" prop="sort">
        <a-input-number v-model="form.sort" :min="0" :max="9999" style="width: 100%" />
      </a-form-model-item>
      <a-form-model-item prop="url">
        <span slot="label">
          菜单路径
          <a-tooltip>
            <template slot="title">
              访问的组件路径，如：`system/user/index`，默认在`views`目录下
            </template>
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-input v-model="form.url" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item prop="permissions">
        <span slot="label">
          权限标识
          <a-tooltip>
            <template slot="title">
              控制器中定义的权限字符，如 system:user:list
            </template>
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-input v-model="form.permissions" placeholder="请输入" :maxLength="100" />
      </a-form-model-item>
      <div class="bottom-control">
        <a-space>
          <a-button type="primary" :loading="submitLoading" @click="submitForm">
            保存
          </a-button>
          <a-button type="dashed" @click="cancel">
            取消
          </a-button>
        </a-space>
      </div>
    </a-form-model>
  </a-drawer>
</template>

<script>

import { getMenu, addMenu, updateMenu } from '@/api/sys/menu'
import allIcon from '@/core/icons'
import icons from '@/utils/requireIcons'
import IconSelector from '@/components/IconSelector'

export default {
  name: 'CreateForm',
  props: {
    menuOptions: {
      type: Array,
      required: true
    }
  },
  components: {
    IconSelector
  },
  data () {
    return {
      allIcon,
      iconVisible: false,
      iconList: icons,
      submitLoading: false,
      formTitle: '',
      // 表单参数
      form: {
        id: '',
        pid: 0,
        name: '',
        icon: '',
        type: 0,
        sort: 1
      },
      open: false,
      rules: {
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '菜单路径不能为空', trigger: 'blur' }]
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
    filterIcons () {
      this.iconList = icons
      if (this.name) {
        this.iconList = this.iconList.filter(item => item.includes(this.name))
      }
    },
    onClose () {
      this.open = false
      this.iconVisible = false
    },
    hideIconSelect () {
      this.iconList = icons
      this.iconVisible = false
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.iconVisible = false
      this.reset()
    },
    // 表单重置
    reset () {
      this.form = {
        id: '',
        pid: 0,
        name: '',
        icon: '',
        type: 0,
        sort: 1
      }
    },
     /** 新增按钮操作 */
    handleAdd (row) {
      this.reset()
      this.$emit('select-tree')
      if (row != null && row.id) {
        this.form.pid = row.id
      } else {
        this.form.pid = 0
      }
      this.open = true
      this.formTitle = '添加菜单'
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset()
      this.$emit('select-tree')
      getMenu(row.id).then(response => {
        this.form = response.data
        this.form.type = "" + response.data.type
        this.form.authLevel = "" + response.data.authLevel
        this.open = true
        this.formTitle = '修改菜单'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          if (this.form.id !== '') {
            updateMenu(this.form).then(response => {
              this.$message.success(
                '修改成功',
                3
              )
              this.open = false
              this.iconVisible = false
              this.$emit('ok')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            addMenu(this.form).then(response => {
              this.$message.success(
                '新增成功',
                3
              )
              this.open = false
              this.iconVisible = false
              this.$emit('ok')
            }).finally(() => {
              this.submitLoading = false
            })
          }
        } else {
          return false
        }
      })
    },
    handleIconChange (icon) {
      this.iconVisible = false
      this.form.icon = icon
    },
    changeIcon (type) {
      this.currentSelectedIcon = type
    },
    selectIcon () {
      this.iconVisible = !this.iconVisible
    },
    cancelSelectIcon () {
      this.iconVisible = false
    }
  }
}
</script>
