const PERMISSION_ENUM = {
  'enable': { key: 'look', label: '查看', value: 1 << 0 },
  'add': { key: 'add', label: '新增', value: 1 << 1 },
  'edit': { key: 'edit', label: '修改', value: 1 << 2 },
  'delete': { key: 'delete', label: '删除', value: 1 << 3 },
  'get': { key: 'get', label: '详情', value: 1 << 4 },
  'query': { key: 'query', label: '查询', value: 1 << 5 },
  'print': { key: 'print', label: '打印', value: 1 << 6 },
  'import': { key: 'import', label: '导入', value: 1 << 7 },
  'export': { key: 'export', label: '导出', value: 1 << 8 }
}
/**
 * 根据actions 建造权限值数据
 * @param {*} actions
 */
export const buildPermissionArray = function (actions) {
  const permissions = []
  actions.forEach(item => {
    permissions.push(item.value)
  })
  return permissions
}
/**
 * 构建选中权限数组
 * @param {*} actions
 */
export const buildCheckPermissionArray = function (permissionValue, permissions) {
  for (var per in PERMISSION_ENUM) {
    const permission = PERMISSION_ENUM[per]
    if ((permissionValue & permission.value) === permission.value) {
      permissions.push(permission.value)
    }
  }
}

function plugin (Vue) {
  if (plugin.installed) {
    return
  }

  !Vue.prototype.$auth && Object.defineProperties(Vue.prototype, {
    $auth: {
      get () {
        const _this = this
        return (permissions) => {
          // 解构成数组类型，并定义变量
          const [permission, action] = permissions.split('.')
          const permissionList = _this.$store.getters['auth/roles'].roleDetailedVos
          return permissionList.find((val) => {
            return val.name === permission
          }).actions.findIndex((val) => {
            return val === action
          }) > -1
        }
      }
    }
  })

  !Vue.prototype.$enum && Object.defineProperties(Vue.prototype, {
    $enum: {
      get () {
        // const _this = this;
        // 根据权限key.key,字符串得到相关所有的的 权限枚举对象，否则返回null
        return (val) => {
          let result = PERMISSION_ENUM
          val && val.split('.').forEach(v => {
            result = result && result[v] || null
          })
          return result
        }
      }
    }
  })
}
export default plugin
