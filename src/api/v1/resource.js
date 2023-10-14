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

// 新增资源
export function addImage (data) {
  return request({
    url: '/admin/sys/resource/image/api/insert',
    method: 'post',
    data: data
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

// 同步图片数据
export function syncIndex () {
  return request({
    url: '/admin/sys/resource/image/api/syncIndex',
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
