import request from '@/utils/request'

// 查询操作日志列表
export function list (query) {
  return request({
    url: '/admin/sys/log/api/operate/query',
    method: 'post',
    data: query
  })
}
