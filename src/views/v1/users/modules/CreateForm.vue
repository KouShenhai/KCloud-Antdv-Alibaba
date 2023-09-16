<template>
  <!-- 增加修改 -->
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="用户名" prop="username" v-if="form.id === undefined">
        <a-input v-model="form.username" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="部门" prop="deptId">
        <a-tree-select
          v-model="form.deptId"
          style="width: 100%"
          @select="onSelect"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="deptOptions"
          placeholder="请选择"
          :replaceFields="replaceFields"
          tree-default-expand-all
        >
        </a-tree-select>
      </a-form-model-item>
      <a-form-model-item label="密码" prop="password" v-if="form.id === undefined">
        <a-input-password v-model="form.password" placeholder="请输入" :maxLength="20" />
      </a-form-model-item>
      <a-form-model-item label="状态" prop="status">
        <a-radio-group v-model="form.status" button-style="solid">
          <a-radio-button v-for="(d, index) in statusOptions" :key="index" :value="d.value">{{ d.label }}</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="角色" prop="roleIds">
        <a-select
          mode="multiple"
          v-model="form.roleIds"
          placeholder="请选择"
        >
          <a-select-option v-for="(d, index) in roleOptions" :key="index" :value="d.value">
            {{ d.label }}
          </a-select-option>
        </a-select>
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

import { getUserById, insertUser, updateUser } from '@/api/v1/user'
import { listRoleOption } from '@/api/v1/role'

export default {
    name: 'CreateForm',
    props: {
      deptOptions: {
        type: Array,
        required: true
      }
    },
    components: {

    },
    data () {
      return {
        submitLoading: false,
        replaceFields: { children: 'children', title: 'name', key: 'id', value: 'id', path: 'path' },
        // 角色选项
        roleOptions: [],
        statusOptions: [
          {
            label: '正常',
            value: 0
          },
          {
            label: '锁定',
            value: 1
          }
        ],
        // 默认密码
        initPassword: 'test123',
        formTitle: '',
        // 表单参数
        form: {
          id: undefined,
          deptId: '',
          username: undefined,
          password: undefined,
          status: '0',
          deptPath: '',
          roleIds: []
        },
        open: false,
        rules: {
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
          ],
          deptId: [
            { required: true, message: '请选择部门', trigger: 'blur' }
          ],
          roleIds: [
            { required: true, message: '请选择角色', trigger: 'blur' }
          ]
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
      nodeFilter (tree, key) {
        tree.forEach(item => {
          if (item.id === key) {
            this.form.deptPath = item.path
          }
          if (item.children) {
            this.nodeFilter(item.children, key)
          }
        })
      },
      onSelect (key, event) {
        this.nodeFilter(this.deptOptions, key)
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
        this.form = {
          id: undefined,
          deptId: '',
          username: undefined,
          password: undefined,
          status: 0,
          deptPath: '',
          roleIds: []
        }
      },
      /** 新增按钮操作 */
      handleAdd () {
        this.reset()
        this.$emit('select-tree')
        listRoleOption().then(response => {
          const roles = []
          response.data.forEach(item => {
            roles.push({
              value: item.value,
              label: item.label
            })
          })
          this.roleOptions = roles
          this.open = true
          this.formTitle = '用户新增'
          this.form.password = this.initPassword
        })
      },
      /** 修改按钮操作 */
      handleUpdate (row) {
        this.reset()
        this.$emit('select-tree')
        // eslint-disable-next-line no-unused-vars
        const id = row.id
        listRoleOption().then(response => {
          const roles = []
          response.data.forEach(item => {
            roles.push({
              value: item.value,
              label: item.label
            })
          })
          this.roleOptions = roles
        })
        getUserById(id).then(response => {
          this.form = response.data
          this.open = true
          this.formTitle = '用户修改'
          this.form.password = ''
        })
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.submitLoading = true
            if (this.form.id !== undefined) {
              const data = { userCO: this.form }
              updateUser(data).then(() => {
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
              const data = { userCO: this.form }
              insertUser(data).then(() => {
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
