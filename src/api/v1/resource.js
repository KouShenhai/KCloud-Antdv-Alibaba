import request from '@/utils/request'

// 查询资源列表
export function listResource (query) {
  return request({
    url: '/admin/v1/resource/list',
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
      'request-id': token
    }
  })
}

// 新增资源
export function addImage (data) {
  return request({
    url: '/admin/sys/resource/image/api/insert',
    method: 'post',
    data: data
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

// 修改图片
export function updateResource (data) {
  return request({
    url: '/admin/v1/resource',
    method: 'put',
    data: data
  })
}

export function searchResource (query) {
  return request({
    url: '/admin/v1/resource/search',
    method: 'post',
    data: query
  })
}

// 删除图片
export function delImage (id) {
  return request({
    url: '/admin/sys/resource/image/api/delete?id=' + id,
    method: 'delete'
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

// 获取审批记录
export function getAuditLog (businessId) {
  return request({
    url: '/admin/sys/resource/image/api/auditLog?businessId=' + businessId,
    method: 'get'
  })
}

// 同步资源
export function syncResourceIndex () {
  return request({
    url: '/admin/v1/resource/sync',
    method: 'post'
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
