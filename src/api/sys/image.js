import request from '@/utils/request'

// 查询图片列表
export function listImage (query) {
  return request({
    url: '/admin/sys/resource/image/api/query',
    method: 'post',
    data: query
  })
}

// 获取图片
export function getImage (id) {
  return request({
    url: '/admin/sys/resource/image/api/detail?id=' + id,
    method: 'get'
  })
}

// 新增图片
export function addImage (data) {
  return request({
    url: '/admin/sys/resource/image/api/insert',
    method: 'post',
    data: data
  })
}

// 修改图片
export function updateImage (data) {
  return request({
    url: '/admin/sys/resource/image/api/update',
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

// 上传图片
export function uploadImage (data) {
  return request({
    url: '/admin/sys/resource/image/api/upload',
    method: 'post',
    data: data,
    headers: {
      'xss-ticket': 'xss-white'
    }
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
