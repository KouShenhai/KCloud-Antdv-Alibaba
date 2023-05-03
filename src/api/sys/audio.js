import request from '@/utils/request'

// 查询音频列表
export function listAudio (query) {
  return request({
    url: '/admin/sys/resource/audio/api/query',
    method: 'post',
    data: query
  })
}

// 获取音频
export function getAudio (id) {
  return request({
    url: '/admin/sys/resource/audio/api/detail?id=' + id,
    method: 'get'
  })
}

// 新增音频
export function addAudio (data) {
  return request({
    url: '/admin/sys/resource/audio/api/insert',
    method: 'post',
    data: data
  })
}

// 修改音频
export function updateAudio (data) {
  return request({
    url: '/admin/sys/resource/audio/api/update',
    method: 'put',
    data: data
  })
}

// 删除音频
export function delAudio (id) {
  return request({
    url: '/admin/sys/resource/audio/api/delete?id=' + id,
    method: 'delete'
  })
}
// 上传音频
export function uploadAudio (data) {
  return request({
    url: '/admin/sys/resource/audio/api/upload',
    method: 'post',
    data: data
  })
}
// 获取审批记录
export function getAuditLog (businessId) {
  return request({
    url: '/admin/sys/resource/audio/api/auditLog?businessId=' + businessId,
    method: 'get'
  })
}

// 同步音频数据
export function syncIndex () {
  return request({
    url: '/admin/sys/resource/audio/api/syncIndex',
    method: 'post'
  })
}

// 审批流程图
export function getDiagram (id) {
  return request({
    url: '/admin/sys/resource/audio/api/diagram?processInstanceId=' + id,
    method: 'get'
  })
}

// 下载音频
export function download (id) {
  return request({
    url: '/admin/sys/resource/audio/api/download?id=' + id,
    method: 'get',
    responseType: 'blob'
  })
}
