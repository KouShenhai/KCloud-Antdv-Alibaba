import request from '@/utils/request'

// 查询字典列表
export function listDict (query) {
  return request({
    url: '/admin/v1/dicts/list',
    method: 'post',
    data: query
  })
}

// 根据类型查询字典
export function listDictByType (type) {
  return request({
    url: '/admin/v1/dicts/' + type + '/option-list',
    method: 'get'
  })
}

// 查看字典
export function getDictById (id) {
  return request({
    url: '/admin/v1/dicts/' + id,
    method: 'get'
  })
}

// 新增字典
export function insertDict (data, token) {
  return request({
    url: '/admin/v1/dicts',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'request-id': token
    }
  })
}

// 修改字典
export function updateDict (data) {
  return request({
    url: '/admin/v1/dicts',
    method: 'put',
    data: data
  })
}

// 删除字典
export function deleteDictById (id) {
  return request({
    url: '/admin/v1/dicts/' + id,
    method: 'delete'
  })
}
