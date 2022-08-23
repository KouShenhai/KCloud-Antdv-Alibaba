import request from '@/utils/request'

// 查询字典类型列表
export function listAudio (query) {
  return request({
    url: '/admin/sys/resource/audio/api/query',
    method: 'post',
    data: query
  })
}

// 查询字典类型详细
export function getAudio (id) {
  return request({
    url: '/admin/sys/resource/audio/api/detail?id=' + id,
    method: 'get'
  })
}

// 新增字典类型
export function addAudio (data) {
  return request({
    url: '/admin/sys/resource/audio/api/insert',
    method: 'post',
    data: data
  })
}

// 修改字典类型
export function updateAudio (data) {
  return request({
    url: '/admin/sys/resource/audio/api/update',
    method: 'put',
    data: data
  })
}

// 删除字典类型
export function delAudio (id) {
  return request({
    url: '/admin/sys/resource/audio/api/delete?id=' + id,
    method: 'delete'
  })
}