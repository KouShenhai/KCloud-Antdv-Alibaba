import request from '@/utils/request'
// 在线列表
export function listOnline (query) {
  return request({
    url: '/admin/sys/user/api/online/query',
    method: 'post',
    data: query
  })
}

// 账号踢出
export function killOnline (token) {
  return request({
    url: '/admin/sys/user/api/online/kill?token=' + token,
    method: 'delete'
  })
}
