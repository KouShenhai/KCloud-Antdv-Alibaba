<template>
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="角色名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="角色排序" prop="sort">
        <a-input-number placeholder="请输入" v-model="form.sort" :min="0" style="width: 100%"/>
      </a-form-model-item>
      <a-form-model-item label="数据权限">
        <a-checkbox @change="handleCheckedTreeExpand2($event)">
          展开/折叠
        </a-checkbox>
        <a-checkbox @change="handleCheckedTreeNodeAll2($event)">
          全选/全不选
        </a-checkbox>
        <a-tree
          v-model="deptCheckedKeys"
          checkable
          :checkStrictly="!form.deptCheckStrictly"
          :expanded-keys="deptExpandedKeys"
          :auto-expand-parent="autoExpandParent2"
          :tree-data="deptOptions"
          @expand="onExpandDept"
          @check="onCheck2"
          :replaceFields="defaultProps2"
        />
      </a-form-model-item>
      <a-form-model-item label="菜单列表">
        <a-checkbox @change="handleCheckedTreeExpand($event)">
          展开/折叠
        </a-checkbox>
        <a-checkbox @change="handleCheckedTreeNodeAll($event)">
          全选/全不选
        </a-checkbox>
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

import { getRole, addRole, updateRole } from '@/api/sys/role'
import { treeSelect as menuTreeSelect, roleMenuTreeSelect } from '@/api/sys/menu'
import { treeSelect as deptTreeSelect, roleDeptTreeSelect } from '@/api/sys/dept'
export default {
  name: 'CreateForm',
  props: {

  },
  components: {
  },
  data () {
    return {
      deptCheckedKeys: [],
      deptExpandedKeys: [],
      submitLoading: false,
      menuExpandedKeys: [],
      autoExpandParent2: false,
      autoExpandParent: false,
      menuCheckedKeys: [],
      halfCheckedKeys: [],
      halfCheckedKeys2: [],
      menuOptions: [],
      menuOptionsAll: [],
      deptOptionsAll: [],
      formTitle: '',
      // 部门列表
      deptOptions: [],
      // 表单参数
      form: {
        id: undefined,
        name: undefined,
        sort: 0,
        menuIds: [],
        menuCheckStrictly: false,
        deptCheckStrictly: false
      },
      open: false,
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '显示顺序不能为空', trigger: 'blur' }]
      },
      defaultProps: {
        children: 'children',
        title: 'name',
        key: 'id'
      },
      defaultProps2: {
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
    this.getDeptTreeSelect()
  },
  computed: {
  },
  watch: {
  },
  methods: {
    onExpandDept (expandedKeys) {
      this.deptExpandedKeys = expandedKeys
      this.autoExpandParent2 = false
    },
    handleCheckedTreeNodeAll2 (value) {
      if (value.target.checked) {
        this.getAllDeptNode(this.deptOptions)
      } else {
        this.deptCheckedKeys = []
        this.halfCheckedKeys2 = []
      }
    },
    getAllDeptNode (nodes) {
      if (!nodes || nodes.length === 0) {
        return []
      }
      nodes.forEach(node => {
        this.deptCheckedKeys.push(node.id)
        return this.getAllDeptNode(node.children)
      })
    },
    onExpandMenu (expandedKeys) {
      this.menuExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    /** 查询菜单树结构 */
    getMenuTreeSelect () {
      menuTreeSelect().then(response => {
        this.menuOptions = response.data.children
        this.menuOptionsAll = this.menuOptions
      })
    },
    handleCheckedTreeExpand2 (value) {
      if (value.target.checked) {
        const treeList = this.deptOptions
        for (let i = 0; i < treeList.length; i++) {
          this.deptExpandedKeys.push(treeList[i].id)
        }
      } else {
        this.deptExpandedKeys = []
      }
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
    // 回显过滤
    selectNodeFilter2 (nodes, parentIds) {
      if (!nodes || nodes.length === 0) {
        return []
      }
      nodes.forEach(node => {
        // 父子关联模式且当前元素有父级
        const currentIndex = this.deptCheckedKeys.indexOf(node.id)
        // 当前节点存在,且父节点不存在，则说明父节点应是半选中状态
        if (currentIndex !== -1) {
          parentIds.forEach(parentId => {
            if (this.halfCheckedKeys2.indexOf(parentId) === -1) {
              this.halfCheckedKeys2.push(parentId)
            }
          })
          parentIds = []
        }
        // 防重
        const isExist = this.halfCheckedKeys2.indexOf(node.id)
        const isExistParentIds = parentIds.indexOf(node.id)
        if (isExist === -1 && isExistParentIds === -1 && currentIndex === -1) {
          parentIds.push(node.id)
        }
        return this.selectNodeFilter2(node.children, parentIds)
      })
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys () {
      // 全选与半选
      return this.deptCheckedKeys
    },
    handleCheckedTreeNodeAll (value) {
      if (value.target.checked) {
        this.getAllMenuNode(this.menuOptions)
      } else {
        this.menuCheckedKeys = []
        this.halfCheckedKeys = []
      }
    },
    handleCheckedTreeExpand (value) {
      if (value.target.checked) {
        const treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          this.menuExpandedKeys.push(treeList[i].id)
        }
      } else {
        this.menuExpandedKeys = []
      }
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeSelect (roleId) {
      return roleMenuTreeSelect(roleId).then(response => {
        this.menuOptions = this.menuOptionsAll
        return response
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
    onCheck2 (checkedKeys, info) {
      if (!this.form.deptCheckStrictly) {
        let currentCheckedKeys = []
        if (this.deptCheckedKeys.checked) {
          currentCheckedKeys = currentCheckedKeys.concat(this.deptCheckedKeys.checked)
        }
        if (this.deptCheckedKeys.halfChecked) {
          currentCheckedKeys = currentCheckedKeys.concat(this.deptCheckedKeys.halfChecked)
        }
        this.deptCheckedKeys = currentCheckedKeys
      } else {
        // 半选节点
        this.halfCheckedKeys2 = info.halfCheckedKeys
        this.deptCheckedKeys = checkedKeys
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
    /** 查询部门树结构 */
    getDeptTreeSelect () {
      deptTreeSelect().then(response => {
        this.deptOptions = response.data.children
        this.deptOptionsAll = response.data.children
      })
    },
    // 表单重置
    reset () {
      this.deptExpandedKeys = []
      this.menuExpandedKeys = []
      this.autoExpandParent = false
      this.autoExpandParent2 = false
      this.menuCheckedKeys = []
      this.deptCheckedKeys = []
      this.halfCheckedKeys = []
      this.halfCheckedKeys2 = []
      this.form = {
        id: undefined,
        name: '',
        sort: 1,
        menuIds: [],
        menuCheckStrictly: false,
        deptCheckStrictly: false
      }
    },
     /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.open = true
      this.formTitle = '角色新增'
    },
    /** 根据角色ID查询部门树结构 */
    getRoleDeptTreeSelect (roleId) {
      return roleDeptTreeSelect(roleId).then(response => {
        this.deptOptions = this.deptOptionsAll
        return response
      })
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset()
      const roleId = row.id
      const roleMenu = this.getRoleMenuTreeSelect(roleId)
      const roleDept = this.getRoleDeptTreeSelect(roleId)
      getRole(roleId).then(response => {
        this.form = response.data
        this.form.menuCheckStrictly = false
        this.form.deptCheckStrictly = false
        this.open = true
        this.$nextTick(() => {
          roleMenu.then(res => {
            this.menuCheckedKeys = res.data
            // 过滤回显时的半选中node(父)
            if (this.form.menuCheckStrictly) {
              this.selectNodeFilter(this.menuOptions, [])
            }
          })
          roleDept.then(res => {
            this.deptCheckedKeys = res.data
            // 过滤回显时的半选中node(父)
            if (this.form.deptCheckStrictly) {
              this.selectNodeFilter2(this.deptOptions, [])
            }
          })
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
            this.form.deptIds = this.getDeptAllCheckedKeys()
            updateRole(this.form).then(response => {
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
            this.form.deptIds = this.getDeptAllCheckedKeys()
            addRole(this.form).then(response => {
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
