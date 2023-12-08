import request from '@/utils/request'
// 查询资源列表
export function listResource (query) {
  return request({
    url: '/admin/v1/resource/list',
    method: 'post',
    data: query
  })
}

// 资源任务分页
export function listResourceTask (query) {
  return request({
    url: '/admin/v1/resource/task-list',
    method: 'post',
    data: query
  })
}

// 根据ID获取资源
export function getResourceById (id) {
  return request({
    url: '/admin/v1/resource/' + id,
    method: 'get'
  })
}

// 详情
export function getResourceDetailTask (id) {
  return request({
    url: '/admin/v1/resource/' + id + '/detail-task',
    method: 'get'
  })
}

// 审批
export function auditResourceTask (data, token) {
  return request({
    url: '/admin/v1/resource/audit-task',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Request-Id': token
    }
  })
}

// 资源委派任务
export function delegateResourceTask (data, token) {
  return request({
    url: '/admin/v1/resource/delegate-task',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Request-Id': token
    }
  })
}

// 资源处理任务
export function resolveResourceTask (data, token) {
  return request({
    url: '/admin/v1/resource/resolve-task',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Request-Id': token
    }
  })
}

// 资源转办任务
export function transferResourceTask (data, token) {
  return request({
    url: '/admin/v1/resource/transfer-task',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Request-Id': token
    }
  })
}

// 修改资源
export function updateResource (data, token) {
  return request({
    url: '/admin/v1/resource',
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Request-Id': token
    }
  })
}

// 同步资源
export function searchResource (query) {
  return request({
    url: '/admin/v1/resource/search',
    method: 'post',
    data: query
  })
}

// 上传资源
export function uploadResource (data) {
  return request({
    url: '/admin/v1/resource/upload',
    method: 'post',
    data: data
  })
}

// 同步资源
export function syncResourceIndex () {
  return request({
    url: '/admin/v1/resource/sync',
    method: 'post'
  })
}

// 新增资源
export function insertResource (data, token) {
  return request({
    url: '/admin/v1/resource',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Request-Id': token
    }
  })
}

// 删除图片
export function delImage (id) {
  return request({
    url: '/admin/sys/resource/image/api/delete?id=' + id,
    method: 'delete'
  })
}

// 获取审批记录
export function getAuditLog (businessId) {
  return request({
    url: '/admin/sys/resource/image/api/auditLog?businessId=' + businessId,
    method: 'get'
  })
}

// 审批流程图
export function getDiagram (id) {
  return request({
    url: '/admin/sys/resource/image/api/diagram?processInstanceId=' + id,
    method: 'get'
  })
}

// 下载图片
export function download (id) {
  return request({
    url: '/admin/sys/resource/image/api/download?id=' + id,
    method: 'get',
    responseType: 'blob'
  })
}
