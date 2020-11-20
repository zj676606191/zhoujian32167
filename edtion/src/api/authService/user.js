/*
 * @Author: ChenXingLiang
 * @Date: 2019-07-28 23:28:48
 * @LastEditors: ChenXingLiang
 * @LastEditTime: 2019-08-09 13:50:39
 * @Description: 授权相关接口
 */

import { axios } from '@/utils/request'

/**
 * 授权服务接口
 * @export
 * @class authService
 */
export default class userService {
  /**
   * 获取当前登录用户基础信息与权限
   */
  static getInfo () {
    return axios({
      url: '/login/userInfo',
      method: 'get'
    })
  }
}
