import request from '@/utils/request'
// 查询用户列表
export function listUser (query) {
  return request({
    url: '/admin/v1/users/list',
    method: 'post',
    data: query
  })
}

// 获取用户
export function getUserById (id) {
  return request({
    url: '/admin/v1/users/' + id,
    method: 'get'
  })
}
// 新增用户
export function insertUser (data) {
  return request({
    url: '/admin/v1/users',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser (data) {
  return request({
    url: '/admin/v1/users',
    method: 'put',
    data: data
  })
}

// 删除用户
export function deleteUserById (id) {
  return request({
    url: '/admin/v1/users/' + id,
    method: 'delete'
  })
}

// 用户密码重置
export function resetUserPassword (data) {
  return request({
    url: '/admin/v1/users/reset-password',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function updateUserStatus (data) {
  return request({
    url: '/admin/v1/users/status',
    data: data,
    method: 'put'
  })
}

// 修改用户个人信息
export function updateInfo (data) {
  return request({
    url: '/admin/sys/user/api/info',
    method: 'put',
    data: data
  })
}

// 用户头像上传
export function uploadAvatar (data) {
  return request({
    url: '/admin/sys/oss/api/upload',
    method: 'post',
    data: data
  })
}

// 用户下拉列表
export function listUserOption () {
  return request({
    url: '/admin/v1/users/option-list',
    method: 'get'
  })
}

// 重置密码
export function resetPassword (id, pwd) {
  return request({
    url: '/admin/sys/user/api/pwd?id=' + id + '&newPassword=' + pwd,
    method: 'put'
  })
}
