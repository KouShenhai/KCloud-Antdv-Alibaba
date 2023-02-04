import request from '@/utils/request'

export const userApi = {
  Login: '/auth/oauth2/token',
  Logout: '/auth/oauth2/logout',
  UserInfo: '/admin/sys/user/api/userInfo',
  Captcha: '/auth/oauth2/password/captcha',
}

/**
 * login func
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter,
    // 设置序列化请求函数
    transformRequest: (data = {}) => Object.entries(data).map(ent => ent.join('=')).join('&'),
    headers: {
      'Authorization': 'Basic YXV0aC1jbGllbnQ6c2VjcmV0',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
}

export function captcha (uuid) {
  return request({
    url: userApi.Captcha + '?uuid=' + uuid,
    method: 'get',
    headers: {
      'gray': 'true'
    }
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout (token) {
  return request({
    url: userApi.Logout,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': 'Bearer ' + token,
      'gray': 'true'
    }
  })
}
