import storage from 'store'
import { login, getInfo, logout, ssoOut } from '@/api/login'
import { ACCESS_TOKEN, USER_ID, USER_NAME, TENANT_ID, AUTH_TYPE } from '@/store/mutation-types'
import SparkMD5 from 'spark-md5'

const user = {
  state: {
    token: '',
    name: '',
    id: '',
    welcome: '欢迎您，来到老寇云平台',
    avatar: '',
    permissions: [],
    tenantId: '',
    authType: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_USER_ID: (state, id) => {
      state.id = id
    },
    SET_TENANT_ID: (state, tenantId) => {
      state.tenantId = tenantId
    },
    SET_AUTH_TYPE: (state, authType) => {
      state.authType = authType
    }
  },

  actions: {
    // 登录
    Login ({ commit }, loginParam) {
      return new Promise((resolve, reject) => {
        login(loginParam).then(res => {
          storage.set(ACCESS_TOKEN, res.access_token, 60 * 60 * 1000)
          storage.set(AUTH_TYPE, loginParam.auth_type, 60 * 60 * 1000)
          commit('SET_TOKEN', res.access_token)
          commit('SET_AUTH_TYPE', loginParam.auth_type)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    GetMD5 ({ commit }, file) {
      return new Promise((resolve) => {
        const sparkMD5 = new SparkMD5.ArrayBuffer()
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        // 异步执行函数
        reader.onload = function (e) {
          sparkMD5.append(e.target.result)
          resolve(sparkMD5.end(false))
        }
      })
    },
    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const user = res.data
          const id = user.id
          const name = user.username
          const tenantId = user.tenantId
          const avatar = user.avatar === '' ? require('@/assets/images/profile.jpg') : user.avatar
          if (user.permissionList && user.permissionList.length > 0) {
            commit('SET_PERMISSIONS', user.permissionList)
          }
          commit('SET_TENANT_ID', tenantId)
          commit('SET_USER_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_USER_ID', id)
          storage.set(USER_ID, id, 60 * 60 * 1000)
          storage.set(USER_NAME, name, 60 * 60 * 1000)
          storage.set(TENANT_ID, tenantId, 60 * 60 * 1000)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit }) {
      return new Promise((resolve, reject) => {
        const authType = storage.get(AUTH_TYPE)
        if (authType === 1) {
          ssoOut().then(() => {})
        }
        logout(storage.get(ACCESS_TOKEN)).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_AUTH_TYPE', '')
          commit('SET_PERMISSIONS', [])
          storage.remove(ACCESS_TOKEN)
          storage.remove(AUTH_TYPE)
        })
      })
    }

  }
}

export default user
