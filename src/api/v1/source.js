import request from '@/utils/request'

// 查询数据源列表
export function listSource (query) {
  return request({
    url: '/admin/v1/sources/list',
    method: 'post',
    data: query
  })
}

// 查询数据源
export function getSourceById (id) {
  return request({
    url: '/admin/v1/sources/' + id,
    method: 'get'
  })
}

// 新增数据源
export function insertSource (data, token) {
  return request({
    url: '/admin/v1/sources',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'request-id': token
    }
  })
}

// 修改数据源
export function updateSource (data) {
  return request({
    url: '/admin/v1/sources',
    method: 'put',
    data: data
  })
}

// 删除数据源
export function deleteSourceById (userId) {
  return request({
    url: '/admin/v1/sources/' + userId,
    method: 'delete'
  })
}

// 数据源下拉列表
export function listSourceOption () {
  return request({
    url: '/admin/v1/sources/option-list',
    method: 'get'
  })
}
