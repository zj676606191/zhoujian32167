import Vue from 'vue'
import Router from 'vue-router'
// 首页
import Index from '@/components/Index'
// UI测试界面
import UiVant from '@/components/view/UiVant'

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        title: '首页'
      }
    },
      {
        path: '/UiVant/:id/',
        name: 'UiVant',
        component: UiVant,
        meta: {
          title: '界面UI测试'
        }
      }
  ]
})
