import storage from 'store'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN, USER_ID, USER_NAME, TENANT_ID } from '@/store/mutation-types'
import SparkMD5 from 'spark-md5'

const user = {
  state: {
    token: '',
    name: '',
    id: '',
    welcome: '欢迎您，来到老寇云平台',
    avatar: '',
    permissions: [],
    tenantId: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_TENANT_ID: (state, tenantId) => {
      state.tenantId = tenantId
    }
  },

  actions: {
    // 登录
    Login ({ commit }, loginParam) {
      return new Promise((resolve, reject) => {
        login(loginParam).then(res => {
          storage.set(ACCESS_TOKEN, res.access_token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', res.access_token)
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
          const id = user.userId
          const name = user.username
          const tenantId = user.tenantId
          const avatar = user.imgUrl === '' ? require('@/assets/images/profile.jpg') : user.imgUrl
          if (user.permissionList && user.permissionList.length > 0) {
            commit('SET_PERMISSIONS', user.permissionList)
          }
          commit('SET_TENANT_ID', tenantId)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_ID', id)
          storage.set(USER_ID, id, 7 * 24 * 60 * 60 * 1000)
          storage.set(USER_NAME, name, 7 * 24 * 60 * 60 * 1000)
          storage.set(TENANT_ID, tenantId, 7 * 24 * 60 * 60 * 1000)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit }) {
      return new Promise((resolve, reject) => {
        logout(storage.get(ACCESS_TOKEN)).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_PERMISSIONS', [])
          storage.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
