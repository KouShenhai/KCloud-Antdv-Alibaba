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

export function saveMessage (data) {
  return request({
    url: '/admin/sys/message/api/insert',
    method: 'post',
    data: data
  })
}

export function unReadCount () {
  return request({
    url: '/admin/sys/message/api/count',
    method: 'get'
  })
}

export function getMessageByDetailId (id) {
  return request({
    url: '/admin/sys/message/api/get?id=' + id,
    method: 'get'
  })
}

export function getMessageById (id) {
  return request({
    url: '/admin/sys/message/api/detail?id=' + id,
    method: 'get'
  })
}