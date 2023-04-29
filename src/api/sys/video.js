import request from '@/utils/request'

// 查询视频列表
export function listVideo (query) {
  return request({
    url: '/admin/sys/resource/video/api/query',
    method: 'post',
    data: query
  })
}
// 获取视频
export function getVideo (id) {
  return request({
    url: '/admin/sys/resource/video/api/detail?id=' + id,
    method: 'get'
  })
}

// 新增视频
export function addVideo (data) {
  return request({
    url: '/admin/sys/resource/video/api/insert',
    method: 'post',
    data: data
  })
}

// 修改视频
export function updateVideo (data) {
  return request({
    url: '/admin/sys/resource/video/api/update',
    method: 'put',
    data: data
  })
}

// 删除视频
export function delVideo (id) {
  return request({
    url: '/admin/sys/resource/video/api/delete?id=' + id,
    method: 'delete'
  })
}
// 上传视频
export function uploadVideo (data) {
  return request({
    url: '/admin/sys/resource/video/api/upload',
    method: 'post',
    data: data,
    headers: {
      'xss-ticket': 'xss-white'
    }
  })
}
// 审批记录
export function getAuditLog (businessId) {
  return request({
    url: '/admin/sys/resource/video/api/auditLog?businessId=' + businessId,
    method: 'get'
  })
}
// 同步视频数据
export function syncIndex () {
  return request({
    url: '/admin/sys/resource/video/api/syncIndex',
    method: 'post'
  })
}
// 审批流程图
export function getDiagram (id) {
  return request({
    url: '/admin/sys/resource/video/api/diagram?processInstanceId=' + id,
    method: 'get'
  })
}
// 下载视频
export function download (id) {
  return request({
    url: '/admin/sys/resource/video/api/download?id=' + id,
    method: 'get'
  })
}
