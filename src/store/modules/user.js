import storage from 'store'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    name: '',
    id: '',
    welcome: '',
    avatar: '',
    roles: [],
    permissions:[]
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
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_ID: (state, id) => {
      state.id = id
    }
  },

  actions: {

    ZFBLogin({ commit },token) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', token)
        resolve()
      })
    },

    // 登录
    Login ({ commit }, loginParam) {
      return new Promise((resolve, reject) => {
        login(loginParam).then(res => {
          storage.set(ACCESS_TOKEN, res.data.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', res.data.token)
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
        getInfo().then(res => {
          const user = res.data
          const id = user.userId;
          const name = user.username
          const avatar = user.imgUrl === '' ? require('@/assets/images/profile.jpg') : user.imgUrl
          if (user.permissionList && user.permissionList.length > 0) {
            commit('SET_PERMISSIONS', user.permissionList)
          }
          if (user.roles && user.roles.length > 0) {
            commit('SET_ROLES', user.roles)
          }
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_ID', id)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          storage.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
