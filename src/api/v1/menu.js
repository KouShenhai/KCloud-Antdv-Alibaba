import request from '@/utils/request'

// 查询菜单列表
export function listMenu (data) {
  return request({
    url: '/admin/v1/menus/list',
    method: 'post',
    data: data
  })
}

// 查看菜单
export function getMenuById (id) {
  return request({
    url: '/admin/v1/menus' + '/' + id,
    method: 'get'
  })
}

// 新增菜单
export function insertMenu (data) {
  return request({
    url: '/admin/v1/menus',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu (data) {
  return request({
    url: '/admin/v1/menus',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function deleteMenuById (id) {
  return request({
    url: '/admin/v1/menus' + '/' + id,
    method: 'delete'
  })
}

// 查询树形下拉菜单列表
export function listMenuTree () {
  return request({
    url: '/admin/v1/menus/tree',
    method: 'get'
  })
}

// 根据角色ID查询菜单树IDS
export function listRoleMenuIDS (roleId) {
  return request({
    url: '/admin/v1/menus/' + roleId + '/ids',
    method: 'get'
  })
}
