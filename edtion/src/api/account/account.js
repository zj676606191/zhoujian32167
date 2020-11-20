/*
 * @Author: Liuj
 * @Date: 2020-06-02 17:36
 * @LastEditors: Liuj
 * @LastEditTime: 2020-06-02 17:36
 * @Description: 协会新闻相关接口
 */
import { axios } from '@/utils/request'

export default class accountService {
  /**
   * 修改密码
   */
  static modifyPwd (params) {
    return axios({
      url: '/account/modifyPwd',
      method: 'PUT',
      data: params
    })
  }
}
