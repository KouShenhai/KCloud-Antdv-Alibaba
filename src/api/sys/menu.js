import request from '@/utils/request'

// 查询菜单列表
export function listMenu (data) {
  return request({
    url: '/admin/sys/menu/api/query',
    method: 'post',
    data: data
  })
}

// 查询菜单详细
export function getMenu (id) {
  return request({
    url: '/admin/sys/menu/api/detail?id=' + id,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeSelect () {
  return request({
    url: '/admin/sys/menu/api/tree',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeSelect (roleId) {
  return request({
    url: '/admin/sys/menu/api/get?roleId=' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu (data) {
  return request({
    url: '/admin/sys/menu/api/insert',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu (data) {
  return request({
    url: '/admin/sys/menu/api/update',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu (menuId) {
  return request({
    url: '/admin/sys/menu/api/delete?id=' + menuId,
    method: 'delete'
  })
}
