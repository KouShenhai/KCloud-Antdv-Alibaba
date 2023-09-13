import request from '@/utils/request'

// 查询套擦
export function listPackage (query) {
  return request({
    url: '/admin/v1/packages/list',
    method: 'post',
    data: query
  })
}

// 查询套餐详情
export function getPackageById (id) {
  return request({
    url: '/admin/v1/packages/' + id,
    method: 'get'
  })
}

// 新增套餐
export function insertPackage (data) {
  return request({
    url: '/admin/v1/packages',
    method: 'post',
    data: data
  })
}

// 修改套餐
export function updatePackage (data) {
  return request({
    url: '/admin/v1/packages',
    method: 'put',
    data: data
  })
}

// 删除套餐
export function deletePackageById (id) {
  return request({
    url: '/admin/v1/packages/' + id,
    method: 'delete'
  })
}

// 套餐下拉列表
export function packageOption () {
  return request({
    url: '/admin/v1/packages/option-list',
    method: 'get'
  })
}
