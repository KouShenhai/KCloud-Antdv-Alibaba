import storage from 'store'
import { login, info, logout, out } from '@/api/v1/login'
import { ACCESS_TOKEN, USER_ID, USER_NAME, TENANT_ID, AUTH_TYPE } from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    name: '',
    id: '',
    welcome: '欢迎您，来到老寇云平台',
    avatar: '',
    permissions: [],
    tenantId: '',
    authType: '',
    superAdmin: ''
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
    },
    SET_SUPER_ADMIN: (state, superAdmin) => {
      state.superAdmin = superAdmin
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
    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        info().then(res => {
          const user = res.data
          const id = user.id
          const name = user.username
          const tenantId = user.tenantId
          const superAdmin = user.superAdmin
          const avatar = user.avatar === '' ? require('@/assets/images/profile.jpg') : user.avatar
          if (user.permissionList && user.permissionList.length > 0) {
            commit('SET_PERMISSIONS', user.permissionList)
          }
          commit('SET_TENANT_ID', tenantId)
          commit('SET_USER_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_USER_ID', id)
          commit('SET_SUPER_ADMIN', superAdmin)
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
          out().then(() => {})
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
          storage.remove(USER_ID)
          storage.remove(USER_NAME)
          storage.remove(TENANT_ID)
        })
      })
    }

  }
}

export default user
