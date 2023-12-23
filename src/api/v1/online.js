import request from '@/utils/request'
// 在线列表
export function listOnline (query) {
  return request({
    url: '/admin/v1/users/online-list',
    method: 'post',
    data: query
  })
}

// 账号踢出
export function killOnline (token) {
  return request({
    url: '/admin/v1/users/kill-online',
    data: { token: token },
    method: 'delete'
  })
}
