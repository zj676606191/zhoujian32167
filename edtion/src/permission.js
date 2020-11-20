import Vue from 'vue'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  // 已经登录
  // 获取本地存储的会话信息 Vue.ls.get
  // if (Vue.ls.get(ACCESS_TOKEN)) { 以前的token模式
  console.warn('cookie获取', VueCookies.get('login_id'))
  if (VueCookies.get('login_id')) {
    /* 登录状态自动跳转到看板首页 */
    if (to.path === '/user/login') {
      next({ path: '/dashboard/workplace' })
      NProgress.done()
    } else {
      console.warn('=====store', store)
      if (store.getters['auth/roles'].length === 0) {
        // 加载用户基础信息
        store
          .dispatch('auth/GetInfo')
          .then(menus => {
            // 生成路由
            store.dispatch('GenerateRoutes', menus).then((routers) => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(routers)
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch((res) => {
            console.warn('返回的错误=======', res)
            // 获取个人数据失败，跳转到登录
            notification.error({
              message: '错误',
              description: res.message
            })
            store.dispatch('auth/Logout').then(() => {
              next({ path: '/user/login', query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    // 白名单路由，判断到之后，就直接执行下个路由的请求
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const action = Vue.directive('action', {
  /**
   * vue 属性绑定
   * @param {*} el htmldom
   * @param {*} binding 绑定的值
   * @param {*} vnode 虚拟dom节点
   */
  bind: function (el, binding, vnode) {
    const actionName = binding.arg
    const roles = store.getters['auth/roles']
    const elVal = vnode.context.$route.meta.permission
    // permissionId 就是菜单name，菜单名称，以后可以加上菜单编码模式
    const permissionId = elVal instanceof String && [elVal] || elVal
    roles.roleDetailedVos.forEach(p => {
      if (!permissionId.includes(p.name)) {
        return
      }
      if (p.actions && !p.actions.includes(actionName)) {
        el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
      }
    })
  }
})

export {
  action
}
