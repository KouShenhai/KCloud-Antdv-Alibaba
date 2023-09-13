<template>
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="套餐名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="菜单列表">
        <a-tree
          v-model="menuCheckedKeys"
          checkable
          :checkStrictly="!form.menuCheckStrictly"
          :expanded-keys="menuExpandedKeys"
          :auto-expand-parent="autoExpandParent"
          :tree-data="menuOptions"
          @check="onCheck"
          @expand="onExpandMenu"
          :replaceFields="defaultProps"
        />
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

import { getPackage, addPackage, updatePackage } from '@/api/v1/package'
import { tenantTreeSelect } from '@/api/sys/menu'
export default {
  name: 'CreateForm',
  props: {

  },
  components: {
  },
  data () {
    return {
      submitLoading: false,
      menuExpandedKeys: [],
      autoExpandParent: false,
      menuCheckedKeys: [],
      halfCheckedKeys: [],
      halfCheckedKeys2: [],
      menuOptions: [],
      menuOptionsAll: [],
      formTitle: '',
      // 表单参数
      form: {
        id: undefined,
        name: undefined,
        menuIds: [],
        menuCheckStrictly: false
      },
      open: false,
      rules: {
        name: [{ required: true, message: '套餐名称不能为空', trigger: 'blur' }]
      },
      defaultProps: {
        children: 'children',
        title: 'name',
        key: 'id'
      }
    }
  },
  filters: {
  },
  created () {
    this.getMenuTreeSelect()
  },
  computed: {
  },
  watch: {
  },
  methods: {
    onExpandMenu (expandedKeys) {
      this.menuExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    /** 查询菜单树结构 */
    getMenuTreeSelect () {
      tenantTreeSelect().then(response => {
        this.menuOptions = response.data.children
        this.menuOptionsAll = this.menuOptions
      })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys () {
      // 全选与半选
      return this.menuCheckedKeys.concat(this.halfCheckedKeys)
    },
    getAllMenuNode (nodes) {
      if (!nodes || nodes.length === 0) {
        return []
      }
      nodes.forEach(node => {
        this.menuCheckedKeys.push(node.id)
        return this.getAllMenuNode(node.children)
      })
    },
    // 回显过滤
    selectNodeFilter (nodes, parentIds) {
      if (!nodes || nodes.length === 0) {
        return []
      }
      nodes.forEach(node => {
        // 父子关联模式且当前元素有父级
        const currentIndex = this.menuCheckedKeys.indexOf(node.id)
        // 当前节点存在,且父节点不存在，则说明父节点应是半选中状态
        if (currentIndex !== -1) {
          parentIds.forEach(parentId => {
            if (this.halfCheckedKeys.indexOf(parentId) === -1) {
              this.halfCheckedKeys.push(parentId)
            }
          })
          parentIds = []
        }
        // 防重
        const isExist = this.halfCheckedKeys.indexOf(node.id)
        const isExistParentIds = parentIds.indexOf(node.id)
        if (isExist === -1 && isExistParentIds === -1 && currentIndex === -1) {
          parentIds.push(node.id)
        }
        return this.selectNodeFilter(node.children, parentIds)
      })
    },
    onCheck (checkedKeys, info) {
      if (!this.form.menuCheckStrictly) {
        let currentCheckedKeys = []
        if (this.menuCheckedKeys.checked) {
          currentCheckedKeys = currentCheckedKeys.concat(this.menuCheckedKeys.checked)
        }
        if (this.menuCheckedKeys.halfChecked) {
          currentCheckedKeys = currentCheckedKeys.concat(this.menuCheckedKeys.halfChecked)
        }
        this.menuCheckedKeys = currentCheckedKeys
      } else {
        // 半选节点
        this.halfCheckedKeys = info.halfCheckedKeys
        this.menuCheckedKeys = checkedKeys
      }
    },
    onClose () {
      this.open = false
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset () {
      this.menuExpandedKeys = []
      this.autoExpandParent = false
      this.menuCheckedKeys = []
      this.halfCheckedKeys = []
      this.halfCheckedKeys2 = []
      this.form = {
        id: undefined,
        name: '',
        menuIds: [],
        menuCheckStrictly: false
      }
    },
     /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.open = true
      this.formTitle = '角色新增'
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset()
      const id = row.id
      getPackage(id).then(response => {
        this.form = response.data
        this.form.menuCheckStrictly = false
        this.open = true
        this.$nextTick(() => {
          this.menuCheckedKeys = response.data.menuIds
          // 过滤回显时的半选中node(父)
          if (this.form.menuCheckStrictly) {
            this.selectNodeFilter(this.menuOptions, [])
          }
        })
        this.formTitle = '角色修改'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          if (this.form.id !== undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            updatePackage(this.form).then(() => {
              this.$message.success(
                '修改成功',
                3
              )
              this.open = false
              this.$emit('ok')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            addPackage(this.form).then(() => {
              this.$message.success(
                '新增成功',
                3
              )
              this.open = false
              this.$emit('ok')
            }).finally(() => {
              this.submitLoading = false
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
