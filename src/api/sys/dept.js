import request from '@/utils/request'

// 查询部门列表
export function queryDept (query) {
  return request({
    url: '/admin/sys/dept/api/query',
    method: 'post',
    data: query
  })
}

export function listDept () {
  return request({
    url: '/admin/sys/dept/api/list',
    method: 'get',
  })
}

// 查询部门详细
export function getDept (id) {
  return request({
    url: '/admin/sys/dept/api/detail?id=' + id,
    method: 'get'
  })
}

// 查询部门下拉树结构
export function treeSelect () {
  return request({
    url: '/admin/sys/dept/api/list',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeSelect (roleId) {
  return request({
    url: '/admin/sys/dept/api/get?roleId=' + roleId,
    method: 'get'
  })
}

// 新增部门
export function addDept (data) {
  return request({
    url: '/admin/sys/dept/api/insert',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept (data) {
  return request({
    url: '/admin/sys/dept/api/update',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept (id) {
  return request({
    url: '/admin/sys/dept/api/delete?id=' + id,
    method: 'delete'
  })
}
