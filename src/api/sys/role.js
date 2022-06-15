import request from '@/utils/request'

// 查询角色列表-分页
export function pageRole (query) {
  return request({
    url: '/admin/sys/role/api/page',
    method: 'post',
    data: query
  })
}

// 查询角色详细
export function getRole (roleId) {
  return request({
    url: '/admin/sys/role/api/detail?id=' + roleId,
    method: 'get'
  })
}

// 查询角色列表
export function listRole (query) {
  return request({
    url: '/admin/sys/role/api/list',
    method: 'post',
    data: query
  })
}

// 新增角色
export function addRole (data) {
  return request({
    url: '/admin/sys/role/api/insert',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole (data) {
  return request({
    url: '/admin/sys/role/api/update',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole (roleId) {
  return request({
    url: '/admin/sys/role/api/delete?id=' + roleId,
    method: 'delete'
  })
}
