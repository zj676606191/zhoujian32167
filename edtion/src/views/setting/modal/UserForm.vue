<!--
 * @Author: ChenXingLiang
 * @Date: 2019-08-07 16:18:59
 * @LastEditors: ChenXingLiang
 * @LastEditTime: 2019-08-15 18:23:54
 * @Description: 用户弹窗
 -->
<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">

      <a-form :form="form" @submit="handleSubmit">

        <a-form-item
          label="用户名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            placeholder="用户名最短6个字符，最长20个字符"
            v-decorator="['userName', {rules: [
              {
                required: true,
                min: 6,
                max: 20,
                message: '用户名最短6个字符，最长20个字符',
                whitespace: true
              }]}]"
          />
        </a-form-item>

        <a-form-item
          label="密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            type="password"
            placeholder="密码最短6个字符"
            v-decorator="['userPwd', {rules: [
              {
                required: true,
                min: 6,
                message: '密码最短6个字符'
              }]}]"
          />
        </a-form-item>

        <a-form-item
          label="确认密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            type="password"
            placeholder="密码最短6个字符"
            v-decorator="['confirmUserPwd', {rules: [
              {
                required: true,
                message: '两次密码不一致',
                validator: (rule, value, callback)=>{
                  const { getFieldValue } = this.form
                  if (value && value !== getFieldValue('userPwd')) {
                    callback('两次输入不一致！')
                  } else {
                    callback()
                  }
                }
              }]}]"
          />
        </a-form-item>
        <a-form-item
          label="禁用"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch v-decorator="[ 'isDeleted', { rules: [], initialValue: false, valuePropName: 'checked'}]">
            <a-icon
              type="check"
              slot="checkedChildren"
            />
            <a-icon
              type="close"
              slot="unCheckedChildren"
            />
          </a-switch>
        </a-form-item>

        <a-form-item
          label="角色"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            v-decorator="[ 'roleId', { rules: [
              {
                required: true,
                message: '角色是必选项',
              }]}]"
            style="width: 160px"
            :loading="isLoadingRole"
          >
            <a-select-option v-for="d in roles" :key="d.roleId" >{{ d.roleName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-alert
            v-if="errorDescription !==''"
            :message="errorDescription"
            type="error"
            showIcon
            closable
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import user from '@/api/managerService'
import permission from '@/api/permissionService'
import pick from 'lodash.pick'
export default {
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      title: '添加用户',
      form: this.$form.createForm(this),
      roles: [],
      isLoadingRole: false,
      curUser: null,
      errorDescription: ''
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    add () {
      this.visible = true
      this.title = '添加用户'
      this.clearForm()
    },
    edit (record) {
      this.clearForm()
      this.curUser = record
      const { form: { setFieldsValue } } = this
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.title = '修改用户: ' + record.userName
      if (record.role) {
        this.mdl['roleId'] = record.role.roleId
        this.mdl['confirmUserPwd'] = record.userPwd
      }
      this.$nextTick(() => {
        setFieldsValue(pick(this.mdl, 'userName', 'userPwd', 'isDeleted', 'roleId', 'confirmUserPwd'))
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          this.confirmLoading = true
          if (this.curUser == null) {
            user.userService.create(values).then((res) => {
              if (res.status > 0) {
                this.errorDescription = res.msg
              } else {
                this.$message.success('保存成功', 1)
                this.visible = false
                this.$emit('ok', values)
              }
              this.confirmLoading = false
            })
          } else {
            values['userId'] = this.curUser.userId
            user.userService.modify(values).then((res) => {
              if (res.status > 0) {
                this.errorDescription = res.msg
              } else {
                this.$message.success('保存成功', 1)
                this.visible = false
                this.$emit('ok', values)
                this.curUser = null
              }
              this.confirmLoading = false
            })
          }
        }
      })
    },
    clearForm () {
      this.form.resetFields()
      this.curUser = null
    },
    handleCancel () {
      this.visible = false
    },
    loadRoles () {
      // 加载角色列表
      this.isLoadingRole = true
      permission.roleService.list().then((res) => {
        this.roles = res.listData
        this.isLoadingRole = false
      })
    }
  }
}
</script>
