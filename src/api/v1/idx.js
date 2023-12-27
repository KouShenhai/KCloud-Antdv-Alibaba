import request from '@/utils/request'

export function listIndex (query) {
  return request({
    url: '/admin/v1/indexs/list',
    method: 'post',
    data: query
  })
}

export function getIndexByIndexName (indexName) {
  return request({
    url: '/admin/v1/indexs/' + indexName,
    method: 'get'
  })
}
