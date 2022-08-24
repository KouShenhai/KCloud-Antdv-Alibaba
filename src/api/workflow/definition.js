import request from '@/utils/request'

// 分页
export function pageDefinition (query) {
  return request({
    url: '/admin/workflow/definition/api/query',
    method: 'post',
    data: query
  })
}

//新增
export function insertDefinition (data) {
  return request({
    url: '/admin/workflow/definition/api/insert',
    method: 'post',
    data: data
  })
}

// 挂起
export function suspendDefinition (definitionId) {
  return request({
    url: '/admin/workflow/definition/api/suspend?definitionId=' + definitionId,
    method: 'put'
  })
}

// 激活
export function activateDefinition (definitionId) {
  return request({
    url: '/admin/workflow/definition/api/activate?definitionId=' + definitionId,
    method: 'put'
  })
}

// 删除
export function delDefinition (deploymentId) {
  return request({
    url: '/admin/workflow/definition/api/delete?deploymentId=' + deploymentId,
    method: 'delete'
  })
}
