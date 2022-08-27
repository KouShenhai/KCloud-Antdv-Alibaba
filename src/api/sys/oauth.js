import request from '@/utils/request'

// 查询字典类型列表
export function listOauth (query) {
  return request({
    url: '/admin/sys/oauth/api/query',
    method: 'post',
    data: query
  })
}

export function getOauth (id) {
  return request({
    url: '/admin/sys/oauth/api/detail?id=' + id,
    method: 'get'
  })
}

// 新增字典类型
export function addOauth (data) {
  return request({
    url: '/admin/sys/oauth/api/insert',
    method: 'post',
    data: data
  })
}

// 修改字典类型
export function updateOauth (data) {
  return request({
    url: '/admin/sys/oauth/api/update',
    method: 'put',
    data: data
  })
}

// 删除字典类型
export function delOauth (id) {
  return request({
    url: '/admin/sys/oauth/api/delete?id=' + id,
    method: 'delete'
  })
}