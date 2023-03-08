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
export function auditTask (data) {
  return request({
    url: '/admin/workflow/task/api/resource/audit',
    method: 'post',
    data: data
  })
}

// 详情
export function detailTask (id) {
  return request({
    url: '/admin/workflow/task/api/resource/detail?id=' + id,
    method: 'get'
  })
}

// 转办
export function transferTask (data) {
  return request({
    url: '/admin/workflow/task/api/resource/transfer',
    method: 'post',
    data: data
  })
}

// 委派
export function delegateTask (data) {
  return request({
    url: '/admin/workflow/task/api/resource/delegate',
    method: 'post',
    data: data
  })
}

// 处理
export function resolveTask (data) {
  return request({
    url: '/admin/workflow/task/api/resource/resolve',
    method: 'post',
    data: data
  })
}
