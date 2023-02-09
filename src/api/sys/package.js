import request from '@/utils/request'

// 查询套擦
export function pagePackage (query) {
  return request({
    url: '/admin/sys/package/api/query',
    method: 'post',
    data: query
  })
}

// 查询套餐详情
export function getPackage (id) {
  return request({
    url: '/admin/sys/package/api/detail?id=' + id,
    method: 'get'
  })
}

// 新增套餐
export function addPackage (data) {
  return request({
    url: '/admin/sys/package/api/insert',
    method: 'post',
    data: data
  })
}

// 修改套餐
export function updatePackage (data) {
  return request({
    url: '/admin/sys/package/api/update',
    method: 'put',
    data: data
  })
}

// 删除套餐
export function delPackage (id) {
  return request({
    url: '/admin/sys/package/api/delete?id=' + id,
    method: 'delete'
  })
}

// 套餐下拉列表
export function packageOption () {
  return request({
    url: '/admin/sys/package/api/option/list',
    method: 'get'
  })
}