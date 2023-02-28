import request from '@/utils/request'

// 查询字典类型列表
export function listImage (query) {
  return request({
    url: '/admin/sys/resource/image/api/query',
    method: 'post',
    data: query
  })
}

export function getImage (id) {
  return request({
    url: '/admin/sys/resource/image/api/detail?id=' + id,
    method: 'get'
  })
}

// 新增字典类型
export function addImage (data) {
  return request({
    url: '/admin/sys/resource/image/api/insert',
    method: 'post',
    data: data
  })
}

// 修改字典类型
export function updateImage (data) {
  return request({
    url: '/admin/sys/resource/image/api/update',
    method: 'put',
    data: data
  })
}

// 删除字典类型
export function delImage (id) {
  return request({
    url: '/admin/sys/resource/image/api/delete?id=' + id,
    method: 'delete'
  })
}

export function uploadImage (data) {
  return request({
    url: '/admin/sys/resource/image/api/upload',
    method: 'post',
    data: data
  })
}

export function getAuditLog (businessId) {
  return request({
    url: '/admin/sys/resource/image/api/auditLog?businessId=' + businessId,
    method: 'get'
  })
}

export function syncIndex () {
  return request({
    url: '/admin/sys/resource/image/api/syncIndex',
    method: 'post'
  })
}

export function getDiagram (id) {
  return request({
    url: '/admin/sys/resource/image/api/diagram?processInstanceId=' + id,
    method: 'get'
  })
}