import { constantRouterMap } from '@/config/router.config'
import { generatorDynamicRouter } from '@/utils/routerUtil'
import { BasicLayout, RouteView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      // 看板路由
      const children = [{
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/analysis',
        component: RouteView,
        hidden: true,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            hidden: true,
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '分析页', keepAlive: false, permission: [ 'dashboard' ] }
          },
          {
            path: '/accountSetting/AccountSetting',
            name: 'AccountSetting',
            hidden: true,
            component: () => import('@/views/accountSetting/AccountSetting'),
            meta: { title: '账户设置', keepAlive: false, permission: [ 'dashboard' ] }
          }
        ]
      }]

      // 加入基础路由，全局看板，都可以看
      const asyncRouterMap = [{
        path: '/',
        name: 'index',
        component: BasicLayout,
        meta: { title: '首页' },
        redirect: '/dashboard/analysis',
        children: children.concat(routers)
      },
      notFoundRouter
      ]

      // 添加的路由状态值
      state.addRouters = asyncRouterMap
      // 连接普通路由和后端路由组合
      state.routers = constantRouterMap.concat(asyncRouterMap)
      console.warn('结束···························')
    }
  },
  actions: {
    /**
     * 构建获取和构建路由和菜单信息
     * @param commit
     * @param data roles 角色信息数据
     * @returns {Promise<any>}
     * @constructor
     */
    GenerateRoutes ({ commit, state }, menus) {
      return new Promise(resolve => {
        console.warn('权限模块开始创建路由')
        // 传递给路由工具包装路由数组对象
        generatorDynamicRouter(menus).then(routers => {
          commit('SET_ROUTERS', routers)
          console.warn('提交', state.addRouters)
          resolve(state.addRouters)
        })
      })
    }
  }
}

export default permission
