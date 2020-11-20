/*
 * @Author: ChenXingLiang
 * @Date: 2019-07-28 23:28:48
 * @LastEditors: ChenXingLiang
 * @LastEditTime: 2019-08-05 15:02:07
 * @Description: 授权相关接口
 */

import { axios } from '@/utils/request'

/**
 * 授权服务接口
 * @export
 * @class authService
 */
export default class authService {
  /**
   * 登录
   * @static
   * @param {*} data
   * @returns
   * @memberof authService
   */
  static login (data) {
    return axios({
      url: '/login/login',
      method: 'post',
      data: data
    })
  }
  /**
   * 退出登录
   * @static
   * @returns
   * @memberof authService
   */
  static logout () {
    return axios({
      url: '/login/out',
      method: 'get'
    })
  }
}
