import request from '@/utils/request'
// 在线列表
export function listOnline () {
  return request({
    url: '/admin/sys/user/api/online/query',
    method: 'get'
  })
}

// 账号踢出
export function killOnline () {
  return request({
    url: '/admin/sys/user/api/online/kill',
    method: 'delete'
  })
}
