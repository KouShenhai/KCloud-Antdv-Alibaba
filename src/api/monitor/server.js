import request from '@/utils/request'

// 查询服务器详细
export function getServer () {
  return request({
    url: '/admin/sys/monitor/api/server',
    method: 'get'
  })
}
