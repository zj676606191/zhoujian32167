/**
 * 地址编码处理工具
 */
import address from '@/config/address'
import { padEnd, flattenDeep, uniqBy } from 'lodash'

/**
 * 根据编码获取编码获取编码树数组
 * @param {*} code
 * @param {*} level
 */
export function getAddressCodeTreeByCode (code, level) {
  if (level === 2) {
    const _address = flattenDeep(address.map(item => { return item.children }))
    return addressCodeTreeByCode(_address, code, level)
  }
  if (level === 3) {
    let _address = flattenDeep(address.map(item => { return item.children }))
    _address = flattenDeep(_address.map(item => { return item.children }))
    return addressCodeTreeByCode(uniqBy(_address, 'value'), code, level)
  }
  return addressCodeTreeByCode(address, code, level)
}

/**
 * 根据编码获取编码获取编码树数组
 * @param {*} list
 * @param {*} code
 * @param {*} level
 */
function addressCodeTreeByCode (list, code, level) {
  const addressCode = []
  let curCode = code.substr(0, level * 2)
  curCode = padEnd(curCode, 6, '0')
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
  if (addObj) {
    addressCode.push(addObj.label + '|' + addObj.value)
  }

  if (addObj && addObj.children) {
    let subAddressCode = []
    subAddressCode = addressCodeTreeByCode(addObj.children, code, level + 1)
    subAddressCode.forEach(function (val, index) {
      addressCode.push(val)
    })
  }
  return addressCode
}
