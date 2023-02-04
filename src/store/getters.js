const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  id: state => state.user.id,
  welcome: state => state.user.welcome,
  permissions: state => state.user.permissions,
  menus: state => state.permission.menus,
  routers: state => state.permission.routers,
  multiTab: state => state.app.multiTab,
  cachedViews: state => state.tagsView.cachedViews
}

export default getters
