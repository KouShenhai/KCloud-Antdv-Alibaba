import request from '@/utils/request'

export function listMessage (query) {
  return request({
    url: '/admin/v1/messages/list',
    method: 'post',
    data: query
  })
}

export function listUnreadMessage (query) {
  return request({
    url: '/admin/v1/messages/unread-list',
    method: 'post',
    data: query
  })
}

export function insertMessage (data, token) {
  return request({
    url: '/admin/v1/messages',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Request-Id': token
    }
  })
}

export function getUnreadMessageCount () {
  return request({
    url: '/admin/v1/messages/unread-count',
    method: 'get'
  })
}

export function getMessageByDetailId (id) {
  return request({
    url: '/admin/v1/messages/' + id,
    method: 'post'
  })
}

export function getMessageById (id) {
  return request({
    url: '/admin/v1/messages/' + id,
    method: 'get'
  })
}
