/*
 * @Author: ChenXingLiang
 * @Date: 2019-07-28 23:28:48
 * @LastEditors: ChenXingLiang
 * @LastEditTime: 2019-08-05 18:57:57
 * @Description: 授权相关接口
 */

import { axios } from '@/utils/request'

/**
 * 授权服务接口
 * @export
 * @class authService
 */
export default class menuService {
  /**
   * 获取树形列表
   */
  static getListTree () {
    return axios({
      url: '/menu/list/tree',
      method: 'get'
    })
  }
}
