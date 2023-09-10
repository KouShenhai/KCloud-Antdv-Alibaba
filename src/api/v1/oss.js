import request from '@/utils/request'

// oss上传
export function uploadOss (data) {
  return request({
    url: '/admin/sys/oss/api/upload',
    method: 'post',
    data: data
  })
}

// 查询存储列表
export function listOss (query) {
  return request({
    url: '/admin/sys/oss/api/query',
    method: 'post',
    data: query
  })
}

// 查询存储详细
export function getOss (id) {
  return request({
    url: '/admin/sys/oss/api/detail?id=' + id,
    method: 'get'
  })
}

// 新增存储
export function addOss (data) {
  return request({
    url: '/admin/sys/oss/api/insert',
    method: 'post',
    data: data
  })
}

// 修改存储
export function updateOss (data) {
  return request({
    url: '/admin/sys/oss/api/update',
    method: 'put',
    data: data
  })
}

// 删除存储
export function delOss (id) {
  return request({
    url: '/admin/sys/oss/api/delete?id=' + id,
    method: 'delete'
  })
}

// 启用存储
export function useOss (id) {
  return request({
    url: '/admin/sys/oss/api/use?id=' + id,
    method: 'get'
  })
}
