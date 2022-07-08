import request from '@/utils/request'

// 分页
export function pageProcess (query) {
  return request({
    url: '/admin/workflow/process/api/query',
    method: 'post',
    data: query
  })
}

// 审批
export function auditTask (query) {
  return request({
    url: '/admin/workflow/task/api/audit',
    method: 'post',
    data: query
  })
}
