// eslint-disable-next-line
import { getRouters } from '@/api/v1/router'
import { indexRouterMap } from '@/config/router.config'
import allIcon from '@/core/icons'
import { validURL } from '@/utils/validate'
import { UserLayout, BlankLayout, PageView } from '@/layouts'
import auth from '@/plugins/auth'
// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: () => import('@/layouts/BasicLayout'),
  BlankLayout: BlankLayout,
  RouteView: () => import('@/layouts/RouteView'),
  PageView: PageView,
  UserLayout: UserLayout, // 登陆注册页面的通用布局
  // 动态引入的页面组件
  'index': () => import('@/views/index')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 根级菜单
const rootMenu = {
  key: '',
  name: 'index',
  path: '',
  component: 'BasicLayout',
  redirect: '/index',
  meta: {
    title: '根路由'
  },
  children: []
}

// 根级路由
const rootRouter = {
  key: '',
  name: 'index',
  path: '',
  component: constantRouterComponents.BasicLayout,
  redirect: '/index',
  meta: {
    title: '工作台'
  },
  children: []
}

/**
 * 动态生成菜单
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    // 向后端请求路由数据
    getRouters().then(res => {
      // 路由菜单分离，路由全部为二级，解决多级菜单缓存问题
      const routers = []
      const menuNav = []
      const routerData = buildRouters(res.data)
      const asyncRoutes = filterDynamicRoutes(indexRouterMap)
      rootMenu.children = asyncRoutes.concat(routerData)
      menuNav.push(rootMenu)
      const menus = generator(menuNav, null, routers)
      menus.push(notFoundRouter)
      rootRouter.children = routers
      resolve({ menus, routers: rootRouter })
    }).catch(err => {
      reject(err)
    })
  })
}

export function buildRouters (routerData) {
  routerData.forEach(route => {
    route.component = route.permission.replaceAll(':', '')
    route.path = route.url
    route.hidden = false
    if (route.children && route.children.length > 0) {
      return buildRouters(route.children)
    }
  })
  return routerData
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes (routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else {
      res.push(route)
    }
  })
  return res
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @param routers
 * @returns {*}
 */
export const generator = (routerMap, parent, routers) => {
  const names = parent ? parent.meta.names : []
  return routerMap.map(item => {
    // 适配一级菜单
    if (item.path === '/' && item.children && item.children.length === 1) {
      item = item.children[0]
      item.children = undefined
    }
    const name = item.component || ''
    const isRouter = item.component && item.component !== 'Layout' && item.component !== 'ParentView'
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: validURL(item.url) ? item.url : item.path || `${parent && parent.path || ''}/${item.path}`,
      // 路由名称，建议唯一
      name: name,
      // 该路由对应页面的 组件(动态加载)
      component: () => import(`@/views${item.path}`),
      hidden: item.hidden,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: item.name,
        icon: allIcon[item.icon + 'Icon'] || item.icon,
        // 目前只能通过判断path的http链接来判断是否外链
        target: validURL(item.url) ? '_blank' : '',
        permission: item.permissions,
        keepAlive: true,
        hidden: item.hidden,
        // 因菜单路由分离，通过此names确定菜单树的展开
        names: names.concat([name])
      }
    }
    const router = {
      path: currentRouter.path,
      // 路由名称，建议唯一
      name: currentRouter.name,
      // 该路由对应页面的 组件(动态加载)
      component: currentRouter.component,
      hidden: currentRouter.hidden,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: currentRouter.meta
    }
    if (router.component && isRouter) {
      routers.push(router)
    }
    // 是否有子菜单，并递归处理，并将父path传入
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter, routers)
    }
    return currentRouter
  })
}
