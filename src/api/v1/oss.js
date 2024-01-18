import request from '@/utils/request'

// OSS上传文件
export function uploadOss (data) {
  return request({
    url: '/admin/v1/oss/upload',
    method: 'post',
    data: data
  })
}

// 查询OSS列表
export function listOss (query) {
  return request({
    url: '/admin/v1/oss/list',
    method: 'post',
    data: query
  })
}

// 根据ID查看OSS
export function getOssById (id) {
  return request({
    url: '/admin/v1/oss/' + id,
    method: 'get'
  })
}

// 新增OSS
export function insertOss (data, token) {
  return request({
    url: '/admin/v1/oss',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Request-Id': token
    }
  })
}

// 修改OSS
export function updateOss (data) {
  return request({
    url: '/admin/v1/oss',
    method: 'put',
    data: data
  })
}

// 删除OSS
export function deleteOssById (id) {
  return request({
    url: '/admin/v1/oss/' + id,
    method: 'delete'
  })
}
