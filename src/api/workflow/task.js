import request from '@/utils/request'

// 分页
export function pageTask (query) {
  return request({
    url: '/admin/workflow/task/api/resource/query',
    method: 'post',
    data: query
  })
}

// 审批
export function auditTask (query) {
  return request({
    url: '/admin/workflow/task/api/resource/audit',
    method: 'post',
    data: query
  })
}

// 详情
export function detailTask (id) {
  return request({
    url: '/admin/workflow/task/api/resource/detail?id=' + id,
    method: 'get'
  })
}
