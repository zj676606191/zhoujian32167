import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
// import auth from '@/store/modules/auth'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import VueCookies from 'vue-cookies'
// 开启cookie模式
axios.defaults.withCredentials = true
// 默认请求头
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000, // 请求超时时间
  withCredentials: true
})
// 错误处理方法
const err = (error) => {
  console.log(error)
  if (error.response) {
    // 登录失效
    if (error.response.status === 302) {
      notification.error({
        message: '登录失效',
        description: '登录超时，请重新登录'
      })
      store.dispatch('auth/Logout').then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })

      return Promise.reject(error)
    }

    const data = error.response.data
    // const token = Vue.ls.get(ACCESS_TOKEN)
    const userId = VueCookies.get('UserId')
    if (error.response.status === 403) {
      // 没有权限，权限不够
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    // 未登录
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      // 未授权
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (userId) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor 拦截器，如果token存在，带上请求头
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers[ACCESS_TOKEN] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor 返回响应数据的data
service.interceptors.response.use((response) => {
  console.log(response)
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
