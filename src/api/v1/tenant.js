import request from '@/utils/request'
// 查询租户列表
export function listTenant (query) {
  return request({
    url: '/admin/v1/tenants/list',
    method: 'post',
    data: query
  })
}

// 查询租户详细
export function getTenant (id) {
  return request({
    url: '/admin/sys/tenant/api/detail?id=' + id,
    method: 'get'
  })
}

// 新增租户
export function addTenant (data) {
  return request({
    url: '/admin/sys/tenant/api/insert',
    method: 'post',
    data: data
  })
}

// 修改租户
export function updateTenant (data) {
  return request({
    url: '/admin/sys/tenant/api/update',
    method: 'put',
    data: data
  })
}

// 删除租户
export function delTenant (id) {
  return request({
    url: '/admin/sys/tenant/api/delete?id=' + id,
    method: 'delete'
  })
}
