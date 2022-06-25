import request from '@/utils/request'

// 查询字典类型列表
export function listDict (query) {
  return request({
    url: '/admin/sys/dict/api/query',
    method: 'post',
    data: query
  })
}

// 查询字典类型详细
export function getDict (dictId) {
  return request({
    url: '/admin/sys/dict/api/detail?id=' + dictId,
    method: 'get'
  })
}

// 新增字典类型
export function addDict (data) {
  return request({
    url: '/admin/sys/dict/api/insert',
    method: 'post',
    data: data
  })
}

// 修改字典类型
export function updateDict (data) {
  return request({
    url: '/admin/sys/dict/api/update',
    method: 'put',
    data: data
  })
}

// 删除字典类型
export function delDict (dictId) {
  return request({
    url: '/admin/sys/dict/api/delete?id=' + dictId,
    method: 'delete'
  })
}