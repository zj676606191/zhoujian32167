/*
 * @Author: ChenXingLiang
 * @Date: 2019-07-28 23:28:48
 * @LastEditors: ChenXingLiang
 * @LastEditTime: 2019-08-09 16:03:03
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
   * 用户列表分页
   * @param {*} data
   */
  static userList (data, pageNum, pageSize) {
    return axios({
      url: `/user/list/${pageNum}/${pageSize}`,
      method: 'post',
      data: data
    })
  }

  /**
   * 创建用户
   * @param {*} data
   */
  static create (data) {
    return axios({
      url: `/user`,
      method: 'post',
      data: data
    })
  }

  /**
   * 修改用户
   * @param {*} data
   */
  static modify (data) {
    return axios({
      url: `/user`,
      method: 'put',
      data: data
    })
  }

  /**
   * 删除用户
   * @param {*} data
   */
  static delete (userId) {
    return axios({
      url: `/user/${userId}`,
      method: 'delete'
    })
  }

  /**
   * 切换状态
   * @param {*} userId
   * @param {*} state
   */
  static changeState (userIds, state) {
    return axios({
      url: `/user/${state}`,
      method: 'patch',
      data: userIds
    })
  }
}
