/*
 * @Author: ChenXingLiang
 * @Date: 2019-08-10 15:49:45
 * @LastEditors: ChenXingLiang
 * @LastEditTime: 2019-08-10 17:18:16
 * @Description: 地址处理工具
 */
import address from '@/config/address'
import { padEnd, flattenDeep, uniqBy } from 'lodash'
/**
 * 根据编码获取完成的文字路径
 * @param {String} code 传入编码
 * @param {Number} level 起始层级
 * @param {String} conn 连接字符
 */
export function getAddressFullNameByCode (code, level, conn) {
  if (level === 2) {
    const _address = flattenDeep(address.map(item => { return item.children }))
    // console.log('二级地址', _address)
    return addressFullNameByCode(_address, code, level, conn)
  }
  if (level === 3) {
    let _address = flattenDeep(address.map(item => { return item.children }))
    _address = flattenDeep(_address.map(item => { return item.children }))
    // console.log('三级地址', _address)
    return addressFullNameByCode(uniqBy(_address, 'value'), code, level, conn)
  }
  return addressFullNameByCode(address, code, level, conn)
}
/**
 * 根据编码获取完成的文字路径
 * @param {*} code
 * @param {*} level
 * @param {*} conn
 */
function addressFullNameByCode (list, code, level, conn) {
  let fullName = ''
  let curCode = code.substr(0, level * 2)
  curCode = padEnd(curCode, 6, '0')
  // console.log('编码', curCode)
  if (list.length === 0) {
    return ''
  }
  const addObj = list.filter(item => {
    if (item) {
      return item.value === curCode
    } else {
      return false
    }
  })[0]
  // console.log('查询结果', addObj)
  if (addObj) {
    fullName = addObj.label
  }
  if (addObj && addObj.children) {
    fullName += conn + addressFullNameByCode(addObj.children, code, level + 1, conn)
  }
  return fullName
}
