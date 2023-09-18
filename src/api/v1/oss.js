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
    url: '/admin/v1/oss/list',
    method: 'post',
    data: query
  })
}

// 查询存储详细
export function getOssById (id) {
  return request({
    url: '/admin/v1/oss/' + id,
    method: 'get'
  })
}

// 新增存储
export function insertOss (data) {
  return request({
    url: '/admin/v1/oss',
    method: 'post',
    data: data
  })
}

// 修改存储
export function updateOss (data) {
  return request({
    url: '/admin/v1/oss',
    method: 'put',
    data: data
  })
}

// 删除存储
export function deleteOssById (id) {
  return request({
    url: '/admin/v1/oss/' + id,
    method: 'delete'
  })
}
