import request from '@/utils/request'

export const menuApi = {
  Router: '/admin/sys/menu/api/list'
}

// 获取路由
export const getRouters = () => {
  return request({
    url: menuApi.Router,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
