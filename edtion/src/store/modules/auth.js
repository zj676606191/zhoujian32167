/*
 * @Author: ChenXingLiang
 * @Date: 2019-08-01 21:52:35
 * @LastEditors: ChenXingLiang
 * @LastEditTime: 2019-08-27 10:21:55
 * @Description: 授权相关
 */
import auth from '@/api/authService'
import { welcome } from '@/utils/util'
import createPersistedState from 'vuex-persistedstate'
import * as types from '@/store/mutation-types'
/**
 * 状态, 保留了token登录方式，后期扩展
 */
const state = {
  token: '', //  token模式保留，以后扩展
  name: '', //  用户名
  welcome: '', // 欢迎语
  avatar: '', // 头像
  roles: [], // 所属角色
  info: {}, // 基础信息
  login: false // 登录状态
}

/**
 * getters 状态包装
 */
const getters = {
  getLoginState: (state, getters) => () => {
    return state.login
  },
  token: state => state.token,
  avatar: state => state.avatar,
  nickname: state => state.name,
  welcome: state => state.welcome,
  roles: state => state.roles,
  userInfo: state => state.info
}

/**
 * mutations 同步处理
 */
const mutations = {
  [types.USER_SET_NAME] (state, { name, welcome }) {
    state.name = name
    state.welcome = welcome
  },
  [types.USER_SET_AVATAR] (state, avatar) {
    state.avatar = avatar
  },
  [types.USER_SET_ROLES] (state, roles) {
    state.roles = roles
  },
  [types.USER_SET_INFO] (state, info) {
    state.info = info
  },
  [types.USER_CHANGE_LOGIN] (state, login) {
    state.login = login
  }
}

/**
 * actions 异步action操作
 */
const actions = {
  /**
   * 用户登录
   * @param {*} param0 , context 状态管理上下文对象,{commit,state,dispatch}
   * @param {*} userInfo
   */
  Login ({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      auth.authService.login(userInfo).then(response => {
        // const result = response.result
        // token登录模式
        // Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
        // commit(types.AUTH_SET_TOKEN, result.token)
        console.warn('返回对象', response)
        if (response.code > 0) {
          commit(types.USER_CHANGE_LOGIN, false)
          reject(response.msg)
          return
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  /**
   * 退出登录
   * @param {*} param0 , context 状态管理上下文对象,{commit,state,dispatch}
   */
  Logout ({ commit, state }) {
    console.log('loginOut')
    return new Promise((resolve) => {
      commit(types.USER_SET_ROLES, [])
      // token登录模式
      // commit(types.AUTH_SET_TOKEN, '')
      // Vue.ls.remove(ACCESS_TOKEN)
      auth.authService.logout().then(() => {
        resolve()
      }).catch(() => {
        resolve()
      })
    })
  },
  GetInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      auth.userService.getInfo().then(response => {
        if (response.status > 0) {
          commit(types.USER_CHANGE_LOGIN, false)
          reject(response.msg)
          return
        }
        const result = response.data
        const userInfo = result.userInfo
        console.warn('vuex-auth 进入了GetInfo方法', response.data)
        // 这里需要角色判断
        if (userInfo.role && userInfo.role.roleDetailedVos.length > 0) {
          /*
          const role = result.role
          role.roleDetailedVos.map(per => {
            if (per.permission != null && per.permission > 0) {
              const action = per.actionEntitySet.map(action => { return action.action })
              per.actionList = action
            }
          })
          */
          // 获取权限菜单名称
          // role.permissionList = role.permissions.map(permission => { return permission.permissionId })
          commit(types.USER_SET_ROLES, userInfo.role)
          commit(types.USER_SET_INFO, result.userInfo)
        } else {
          console.warn('vuex-auth - getInfo: menus must be a non-null array !')
          // reject(new Error('没有获取到任何角色权限信息，您未授权登录该系统'))
          reject(new Error('没有获取到任何角色权限信息，您未授权登录该系统'))
        }

        commit(types.USER_SET_NAME, { name: result.userInfo.userName, welcome: welcome() })
        // commit(types.USER_SET_AVATAR, result.userInfo.avatar)
        // 给加载加载菜单使用
        resolve(result.menus)
      }).catch(error => {
        console.warn('vuex-auth', error)
        reject(error)
      })
    })
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  plugins: [createPersistedState()]
}
