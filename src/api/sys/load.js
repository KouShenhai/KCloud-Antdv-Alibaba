import request from '@/utils/request'
// 新增字典类型
export function login (params) {
  return request({
    url: 'http://175.178.69.253/oauth2/oauth/token' + params,
    method: 'post'
  })
}