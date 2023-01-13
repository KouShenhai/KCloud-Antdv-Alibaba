import request from '@/utils/request'

// 用户头像上传
export function uploadFile (data) {
  return request({
    url: '/oss/api/upload',
    method: 'post',
    data: data
  })
}
