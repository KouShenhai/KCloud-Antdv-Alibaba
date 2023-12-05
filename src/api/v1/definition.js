import request from '@/utils/request'

// 分页
export function listDefinition (query) {
  return request({
    url: '/admin/v1/definitions/list',
    method: 'post',
    data: query
  })
}

// 新增
export function insertDefinition (data, token) {
  return request({
    url: '/admin/v1/definitions',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Request-Id': token
    }
  })
}

// 挂起
export function suspendDefinition (definitionId) {
  return request({
    url: '/admin/v1/definitions/' + definitionId + '/suspend',
    method: 'put'
  })
}

// 激活
export function activateDefinition (definitionId) {
  return request({
    url: '/admin/v1/definitions/' + definitionId + '/activate',
    method: 'put'
  })
}

// 删除
export function delDefinition (deploymentId) {
  return request({
    url: '/admin/v1/definitions/' + deploymentId,
    method: 'delete'
  })
}

export function getDefinitionDiagram (id) {
  return request({
    url: '/admin/v1/definitions/' + id + '/diagram',
    method: 'get'
  })
}

export function definitionTemplate () {
  return request({
    url: '/admin/v1/definitions/template',
    method: 'get',
    responseType: 'blob'
  })
}
