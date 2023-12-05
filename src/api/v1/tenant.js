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
export function getTenantById (id) {
  return request({
    url: '/admin/v1/tenants/' + id,
    method: 'get'
  })
}

// 新增租户
export function insertTenant (data, token) {
  return request({
    url: '/admin/v1/tenants',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Request-Id': token
    }
  })
}

// 修改租户
export function updateTenant (data) {
  return request({
    url: '/admin/v1/tenants',
    method: 'put',
    data: data
  })
}

// 删除租户
export function deleteTenantById (id) {
  return request({
    url: '/admin/v1/tenants/' + id,
    method: 'delete'
  })
}

// 解析域名查看ID
export function getTenantIdByDomainName () {
  return request({
    url: '/admin/v1/tenants/id',
    method: 'get'
  })
}
