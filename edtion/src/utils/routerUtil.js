/*
 * @Author: ChenXingLiang
 * @Date: 2019-08-01 21:52:35
 * @LastEditors: ChenXingLiang
 * @LastEditTime: 2019-08-30 14:28:52
 * @Description: 路由工具
 */

import { BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView

  // 你需要动态引入的页面组件
  // analysis: () => import('@/views/dashboard/Analysis'),
  // workplace: () => import('@/views/dashboard/Workplace'),
  // monitor: () => import('@/views/dashboard/Monitor')
  // ...more
  // 特别注意，组件的名称驼峰，并且组件的vue文件名字也是驼峰
  // setting_permission_role: () => import('@/views/setting/role')
}

/**
 * 获取路由菜单信息
 * @returns {Promise<any>}
 */
export const generatorDynamicRouter = (menus) => {
  return new Promise((resolve, reject) => {
    // 生成路由信息
    const routers = generator(menus)
    // 加入404路由
    console.warn('生成的路由', routers)
    resolve(routers)
  })
}

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    // const component = () => import(`@/views${item.path}`)
    // console.warn('动态路由', component)
    // console.warn('动态路由路径', item.path)
    let component = null
    const name = item.name.replace(/\s*/g, '')
    console.warn('============================================', item.name)
    if (item.component && item.component !== '') {
      component = constantRouterComponents[item.component]
      console.warn('通过组件加载', item.component)
    } else {
      component = constantRouterComponents[name]
      console.warn('通过路由名称加载', name)
    }
    if (!component) {
      let path = item.path
      const _index = path.indexOf(':')
      if (_index > -1) {
        path = path.substring(0, _index - 1)
      }
      component = () => import(`@/views${path}`)
      console.warn('通过path加载', `@/views${item.path}`)
    }

    console.warn('最后得到得对象', component)
    const currentRouter = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      // path: `${parent && parent.path || ''}/${name}`,
      path: `${item.path}`,
      // 路由名称，建议唯一
      name: name || item.code || '',
      // 该路由对应页面的 组件, 如果不是基础组件，就通过路径去动态生成创建
      component: component,
      // 隐藏菜单
      hidden: item.hidden,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.title, icon: item.icon || undefined, permission: name && [ name ] || null }
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRouter.path = currentRouter.path.replace('//', '/')
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}
