import request from '@/utils/request'

// 查询角色列表-分页
export function listRole (query) {
  return request({
    url: '/admin/v1/roles/list',
    method: 'post',
    data: query
  })
}

// 查看角色
export function getRoleById (id) {
  return request({
    url: '/admin/v1/roles/' + id,
    method: 'get'
  })
}

// 查询角色列表
export function listRoleOption () {
  return request({
    url: '/admin/v1/roles/option-list',
    method: 'get'
  })
}

// 新增角色
export function insertRole (data) {
  return request({
    url: '/admin/v1/roles',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole (data) {
  return request({
    url: '/admin/v1/roles',
    method: 'put',
    data: data
  })
}

// 删除角色
export function deleteRole (roleId) {
  return request({
    url: '/admin/sys/role/api/delete?id=' + roleId,
    method: 'delete'
  })
}
