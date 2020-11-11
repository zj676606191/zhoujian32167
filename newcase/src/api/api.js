import axios from 'axios'
var http = 'https://boss.value-education.com/'
// var http3 = 'http://192.168.2.128:10001'
// var http = 'http://192.168.2.124:10001'
// var http = 'http://192.168.2.124:10001/'
// var http = 'http://www.daoba.com.ngrok2.xiaomiqiu.cn'
// var http = 'http://192.168.2.176:10001/'
/**
 * POST类型获取数据测试
 */
export function findUserMoodPage (parameter) {
    return axios({
      url: http + '/api/mood/findUserMoodPage',
      method: 'post',
      data: parameter
    })
  } 
/**
 * GET接口类型测试
 *
 */
export function  findByMiniMechanismTypeSize (value) {
    return axios({
      url: http + '/api/mechanismType/findByMiniMechanismTypeSize',
      method: 'get',
      params: value
    })
  }
  