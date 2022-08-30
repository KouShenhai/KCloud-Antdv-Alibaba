import request from '@/utils/request'

// 搜索资源列表
export function searchResource (query) {
  return request({
    url: '/admin/sys/search/api/resource',
    method: 'post',
    data: query
  })
}