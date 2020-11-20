<template>
  <a-card
    :bordered="false"
    :style="{ height: '100%' }"
  >
    <a-row :gutter="24">
      <a-col :md="4">
        <a-list
          itemLayout="vertical"
          :dataSource="roles"
        >
          <a-list-item
            slot="renderItem"
            slot-scope="item, index"
            :key="index"
          >
            <a-list-item-meta :style="{ marginBottom: '0' }">
              <span
                slot="description"
                style="text-align: center; display: block"
              >{{ item.roleDescribe }}</span>
              <a
                slot="title"
                style="text-align: center; display: block"
                @click="handleEditClick(item)"
              >{{ item.roleName }}（点击编辑）</a>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-col>
      <a-col :md="20">
        <div style="max-width: 1200px">
          <a-divider v-if="isMobile()" />
          <div v-if="mdl.id">
            <h3>角色：{{ mdl.name }}</h3>
          </div>
          <a-form
            :form="form"
            @submit="handleSubmit"
            :layout="isMobile() ? 'vertical' : 'horizontal'"
          >

            <a-form-item label="角色名称">
              <a-input
                v-decorator="[ 'roleName', {rules: [{ required: true, message: '请填写角色名称!' }]} ]"
                placeholder="请填写角色名称"
                style="width: 200px"
                :disabled="isAdmin"
              />
            </a-form-item>

            <a-form-item label="状态">
              <a-checkbox :disabled="isAdmin" v-decorator="[ 'enabled', { rules: [], initialValue: true, valuePropName: 'checked'}]">启用打勾</a-checkbox>
            </a-form-item>

            <a-form-item label="备注说明">
              <a-textarea
                style="width: 900px"
                :row="5"
                v-decorator="[ 'roleDescribe', {rules: [{ required: true, message: '请填写角色描述!' }]} ]"
                placeholder="请填写角色名称"
              />
            </a-form-item>

            <a-form-item label="拥有权限">
              <a-table
                :columns="columns"
                :dataSource="menus"
                rowKey="code"
                :scroll="{ x: 1300 }"
                :defaultExpandAllRows="true"
                :pagination="false"
              >
                <span
                  slot="action"
                  slot-scope="text, record"
                >
                  <a-checkbox
                    :disabled="isAdmin"
                    v-if="record.code==='010000' || record.code==='010100'|| record.code==='010200'"
                    :indeterminate="record.indeterminate"
                    :checked="record.checkAll"
                    @change="(e)=>onCheckAllChange(e, record)"
                  >
                    全选
                  </a-checkbox>
                  <a-checkbox
                    v-else
                    :indeterminate="record.indeterminate"
                    :checked="record.checkAll"
                    @change="(e)=>onCheckAllChange(e, record)"
                  >
                    全选
                  </a-checkbox>
                  <a-checkbox-group
                    v-if="record.code==='010000' || record.code==='010100'|| record.code==='010200'"
                    :disabled="isAdmin"
                    :options="record.actions"
                    v-model="record.checkedList"
                    @change="(checkedList)=>onChange(checkedList, record)"
                  />
                  <a-checkbox-group
                    v-else
                    :options="record.actions"
                    v-model="record.checkedList"
                    @change="(checkedList)=>onChange(checkedList, record)"
                  />
                </span>
              </a-table>
            </a-form-item>
            <a-form-item
              :wrapperCol="{ span: 24 }"
              style="text-align: center"
            >
              <a-button
                htmlType="submit"
                type="primary"
                :loading="saveLoading"
                v-if="$auth('setting_role.edit')"
              >{{ saveTitle }}</a-button>
              <a-button
                style="margin-left: 8px"
                @click="handleAddClick"
                v-if="curRecord!=null && $auth('setting_role.add')"
              >新增角色</a-button>
              <a-popconfirm title="你确认删除该角色，删除之后无法恢复?" @confirm="confirmDelete" okText="确认" cancelText="取消">
                <a-button
                  type="danger"
                  style="margin-left: 8px"
                  v-if="curRecord!=null && $auth('setting_role.delete')"
                  :loading="deleteLoading"
                >删除该角色</a-button>
              </a-popconfirm>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>
<script>
import permission from '@/api/permissionService'
import { mixinDevice } from '@/utils/mixin'
import pick from 'lodash.pick'
import { buildPermissionArray, buildCheckPermissionArray } from '@/utils/helper/permission'

export default {
  name: 'Role',
  mixins: [mixinDevice],
  components: {},
  data () {
    return {
      saveLoading: false,
      deleteLoading: false,
      form: this.$form.createForm(this),
      mdl: {},
      roles: [],
      menus: [],
      saveTitle: '保存修改',
      curRecord: null,
      isAdmin: false,
      columns: [{
        title: '菜单名称',
        dataIndex: 'title',
        key: 'title',
        width: '25%'
      }, {
        title: '菜单路径',
        dataIndex: 'path',
        key: 'path',
        width: '10%'
      }, {
        title: '菜单深度',
        dataIndex: 'grade',
        key: 'grade',
        width: '10%'
      }, {
        title: '菜单权限',
        dataIndex: 'permission',
        key: 'permission',
        width: '55%',
        scopedSlots: { customRender: 'action' }
      }]
    }
  },
  created () {
    this.loadRoles(true)
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const roleData = values
          roleData['roleDetailedDtoList'] = []
          this.getPermissions(this.menus, roleData.roleDetailedDtoList)
          this.saveLoading = true
          if (this.curRecord == null) {
            permission.roleService.create(roleData).then((res) => {
              if (res.status > 0) {
                this.$message.error(res.msg, 2)
              } else {
                this.$message.success('保存成功', 1)
              }
              this.saveLoading = false
              this.clearForm()
              this.loadRoles()
            })
          } else {
            permission.roleService.modify(roleData, this.curRecord.roleId).then((res) => {
              if (res.status > 0) {
                this.$message.error(res.msg, 2)
              } else {
                this.$message.success('保存成功', 1)
              }
              this.saveLoading = false
              this.clearForm()
              this.curRecord = null
              this.saveTitle = '保存新增'
              this.loadRoles()
            })
          }
        }
      })
    },
    // 复选框全选按钮
    onCheckAllChange (e, record) {
      Object.assign(record, {
        checkedList: e.target.checked ? buildPermissionArray(record.actions) : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    onChange (checkedList, record) {
      console.log('选中', record.checkedList)
      record.indeterminate = !!record.checkedList.length && (record.checkedList.length < record.actions.length)
      record.checkAll = record.checkedList.length === record.actions.length
    },
    clearForm () {
      this.form.resetFields()
      this.curRecord = null
      this.clearPermissions(this.menus)
    },
    handleAddClick () {
      this.clearForm()
      this.saveTitle = '保存新增'
      this.isAdmin = false
    },
    confirmDelete () {
      console.log('curRecord:', this.curRecord)
      if (this.curRecord.roleName === '管理员') {
        this.$message.error('管理员角色无法删除', 2)
        return
      }
      this.deleteLoading = false
      permission.roleService.delete(this.curRecord.roleId).then((res) => {
        if (res.status > 0) {
          this.$message.error(res.msg, 2)
        } else {
          this.$message.success('保存成功', 1)
        }
        this.deleteLoading = false
        this.clearForm()
        this.curRecord = null
        this.saveTitle = '保存新增'
        this.loadRoles()
      })
    },
    handleEditClick (record) {
      this.clearForm()
      this.saveTitle = '保存修改'
      this.curRecord = record
      this.mdl = Object.assign({}, record)
      this.checkPermissions(this.menus, record.roleDetailedVos)
      if (this.curRecord.roleName === '管理员') {
        this.isAdmin = true
      } else {
        this.isAdmin = false
      }
      // VDOM 异步调用更新之后，调用nextTick的相关函数，下次更新之后
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'roleName', 'roleDescribe', 'enabled'))
      })
    },
    /**
     * 复选框选中
     */
    onChangeCheck (permission) {
      permission.indeterminate = !!permission.selected.length && (permission.selected.length < permission.actionsOptions.length)
      permission.checkedAll = permission.selected.length === permission.actionsOptions.length
    },
    /**
     * 选中所有
     */
    onChangeCheckAll (e, permission) {
      console.log('permission:', permission)
      Object.assign(permission, {
        selected: e.target.checked ? permission.actionsOptions.map(obj => obj.value) : [],
        indeterminate: false,
        checkedAll: e.target.checked
      })
    },
    loadRoles (setEdit) {
      // 加载角色列表
      permission.roleService.list().then((res) => {
        this.roles = res.listData
        this.loadPermissions(() => {
          if (setEdit) {
            if (this.roles.length > 0) {
              this.handleEditClick(this.roles[0])
            }
          }
        })
        console.log('this.roles', this.roles)
      })
    },
    /**
     * 勾选权限值
     */
    checkPermissions (menus, roleDetailedVos) {
      menus.forEach(menu => {
        const roleDetailedVo = roleDetailedVos.find((roleDetailed) => {
          return roleDetailed.code === menu.code
        })
        // 计算选中项
        if (roleDetailedVo) {
          buildCheckPermissionArray(roleDetailedVo.permission, menu.checkedList)
        }
        menu.indeterminate = !!menu.checkedList.length && (menu.checkedList.length < menu.actions.length)
        menu.checkAll = menu.checkedList.length === menu.actions.length
        if (menu.children) {
          this.checkPermissions(menu.children, roleDetailedVos)
        }
      })
    },
    /**
     * 加载权限数据
     */
    loadPermissions (callback) {
      permission.menuService.getListTree().then((res) => {
        // 注意这个加载问题，因为需要绑定data之前增加属性
        this.setPermissions(res.listData)
        this.menus = res.listData
        if (callback) {
          callback()
        }
      })
    },
    /**
     * 获取权限值
     */
    getPermissions (menus, roleDetailedDtoList) {
      menus.forEach(menu => {
        if (menu.checkedList.length > 0) {
          const roleDetailed = {
            permission: menu.checkedList.reduce((acc, cur) => {
              return acc + cur
            }, 0),
            code: menu.code,
            name: menu.name
          }
          roleDetailedDtoList.push(roleDetailed)
        }
        if (menu.children) {
          this.getPermissions(menu.children, roleDetailedDtoList)
        }
      })
    },
    /**
     * 初始化权限相关字段
     */
    setPermissions (menus) {
      menus.forEach(menu => {
        this.$set(menu, 'indeterminate', false)
        this.$set(menu, 'checkAll', false)
        this.$set(menu, 'checkedList', [])
        if (menu.children.length > 0) {
          this.setPermissions(menu.children)
        } else {
          delete menu.children
        }
      })
    },
    /**
     * 清空权限
     */
    clearPermissions (menus) {
      menus.forEach(menu => {
        menu.checkAll = false
        menu.checkedList = []
        menu.indeterminate = false
        if (menu.children) {
          this.clearPermissions(menu.children)
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
