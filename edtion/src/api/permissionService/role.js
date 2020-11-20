/*
 * @Author: ChenXingLiang
 * @Date: 2019-07-28 23:28:48
 * @LastEditors: ChenXingLiang
 * @LastEditTime: 2019-09-18 09:52:38
 * @Description: 授权相关接口
 */

import { axios } from '@/utils/request'

/**
 * 授权服务接口
 * @export
 * @class authService
 */
export default class roleService {
  /**
   * 角色李彪
   */
  static list () {
    return axios({
      url: '/role/list',
      method: 'post'
    })
  }
  /**
   * 创建角色
   * @param {*} roleData
   */
  static create (roleData) {
    return axios({
      url: '/role',
      method: 'post',
      data: roleData
    })
  }
  /**
   * 更新角色信息
   * @param {*} roleData
   * @param {*} roleId
   */
  static modify (roleData, roleId) {
    return axios({
      url: `/role/${roleId}`,
      method: 'put',
      data: roleData
    })
  }
  /**
   * 删除角色
   * @param {*} roleId
   */
  static delete (roleId) {
    return axios({
      url: `/role/${roleId}`,
      method: 'delete'
    })
  }
}
