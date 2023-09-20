import request from '@/utils/request'

// 查询登录日志列表
export function listLogin (query) {
  return request({
    url: '/admin/v1/logs/login-list',
    method: 'post',
    data: query
  })
}

export function exportLogin (query) {
  return request({
    url: '/admin/v1/logs/login-export',
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}
