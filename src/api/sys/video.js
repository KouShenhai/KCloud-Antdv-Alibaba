import request from '@/utils/request'

// 查询字典类型列表
export function listVideo (query) {
  return request({
    url: '/admin/sys/resource/video/api/query',
    method: 'post',
    data: query
  })
}

export function getVideo (id) {
  return request({
    url: '/admin/sys/resource/video/api/detail?id=' + id,
    method: 'get'
  })
}

// 新增字典类型
export function addVideo (data) {
  return request({
    url: '/admin/sys/resource/video/api/insert',
    method: 'post',
    data: data
  })
}

// 修改字典类型
export function updateVideo (data) {
  return request({
    url: '/admin/sys/resource/video/api/update',
    method: 'put',
    data: data
  })
}

// 删除字典类型
export function delVideo (id) {
  return request({
    url: '/admin/sys/resource/video/api/delete?id=' + id,
    method: 'delete'
  })
}

export function uploadVideo (data) {
  return request({
    url: '/admin/sys/resource/video/api/upload',
    method: 'post',
    data: data
  })
}

export function getAuditLog (businessId) {
  return request({
    url: '/admin/sys/resource/video/api/auditLog?businessId=' + businessId,
    method: 'get'
  })
}

export function completeSyncIndex () {
  return request({
    url: '/admin/sys/resource/video/api/complete/syncIndex',
    method: 'post'
  })
}

export function incrementSyncIndex () {
  return request({
    url: '/admin/sys/resource/video/api/increment/syncIndex',
    method: 'post'
  })
}
