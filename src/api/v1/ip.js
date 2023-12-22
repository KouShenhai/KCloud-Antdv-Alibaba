import request from '@/utils/request'

export function listWhite (query) {
  return request({
    url: '/admin/v1/ips/white/list',
    method: 'post',
    data: query
  })
}

export function deleteWhiteById (id) {
  return request({
    url: '/admin/v1/ips/white/' + id,
    method: 'delete'
  })
}

export function insertWhite (data, token) {
  return request({
    url: '/admin/v1/ips/white',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Request-Id': token
    }
  })
}

export function listBlack (query) {
  return request({
    url: '/admin/v1/ips/black/list',
    method: 'post',
    data: query
  })
}

export function deleteBlackById (id) {
  return request({
    url: '/admin/v1/ips/black/' + id,
    method: 'delete'
  })
}

export function insertBlack (data, token) {
  return request({
    url: '/admin/v1/ips/black',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Request-Id': token
    }
  })
}

export function refreshWhite (label) {
  return request({
    url: '/admin/v1/ips/white/refresh/' + label,
    method: 'get'
  })
}

export function refreshBlack (label) {
  return request({
    url: '/admin/v1/ips/black/refresh/' + label,
    method: 'get'
  })
}
