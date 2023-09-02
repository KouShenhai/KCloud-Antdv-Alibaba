import request from '@/utils/request'

// 查询部门列表
export function listDept (data) {
  return request({
    url: '/admin/v1/depts/list',
    method: 'post',
    data: data
  })
}

// export function listDept () {
//   return request({
//     url: '/admin/sys/dept/api/list',
//     method: 'get'
//   })
// }

// 查询部门详细
export function getDept (id) {
  return request({
    url: '/admin/sys/dept/api/detail?id=' + id,
    method: 'get'
  })
}

// 查询部门下拉树结构
// export function treeSelect () {
//   return request({
//     url: '/admin/sys/dept/api/tree',
//     method: 'get'
//   })
// }

// 根据角色ID查询部门树结构
// export function roleDeptTreeSelect (roleId) {
//   return request({
//     url: '/admin/sys/dept/api/get?roleId=' + roleId,
//     method: 'get'
//   })
// }

// 新增部门
export function insertDept (data) {
  return request({
    url: '/admin/v1/depts',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept (data) {
  return request({
    url: '/admin/v1/depts',
    method: 'put',
    data: data
  })
}

// 删除部门
export function deleteDept (id) {
  return request({
    url: '/admin/v1/depts' + '/' + id,
    method: 'delete'
  })
}
