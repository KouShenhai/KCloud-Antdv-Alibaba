import request from '@/utils/request'

export function listMessage (query) {
  return request({
    url: '/admin/sys/message/api/query',
    method: 'post',
    data: query
  })
}

export function listUnRead (query) {
  return request({
    url: '/admin/sys/message/api/unread/list',
    method: 'post',
    data: query
  })
}

export function sendMessage (data) {
  return request({
    url: '/admin/sys/message/api/send',
    method: 'post',
    data: data
  })
}

// 查询公告详细
export function getNotice (noticeId) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'get'
  })
}

// 新增公告
export function addNotice (data) {
  return request({
    url: '/system/notice',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updateNotice (data) {
  return request({
    url: '/system/notice',
    method: 'put',
    data: data
  })
}
