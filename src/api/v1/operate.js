import request from '@/utils/request'

// 查询操作日志列表
export function listOperate (query) {
  return request({
    url: '/admin/v1/logs/operate-list',
    method: 'post',
    data: query
  })
}

export function operateExport (query) {
  return request({
    url: '/admin/v1/logs/operate-export',
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}
