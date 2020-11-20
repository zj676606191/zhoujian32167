<!-- 账户安全设置 -->
<template>
  <div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="当前密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['password', {rules: ['password',{required: true, min:6, message: '密码最低6个字符'}]}]" />
        </a-form-item>
        <a-form-item label="新密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="password" v-decorator="['newPassword', {rules: ['newPassword',{required: true, min:6, message: '密码最低6个字符'}]}]" />
        </a-form-item>
        <a-form-item label="确认密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="password" v-decorator="['surePassword', {rules: ['surePassword',{required: true, min:6, message: '密码最低6个字符'},{validator: checkNewPassword}]}]" />
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button type="primary" @click="handleSubmit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>
<script>
import accountService from '@/api/account/account'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('auth')
export default {
  data () {
    return {
      confirmLoading: false,
      form: this.$form.createForm(this),
      labelCol: { lg: { span: 3 }, sm: { span: 17 } },
      wrapperCol: { lg: { span: 17 }, sm: { span: 10 } }
    }
  },
  methods: {
    ...mapActions(['Logout']),
    handleSubmit () {
      this.confirmLoading = true
      this.form.validateFields((error, values) => {
        if (error) {
          this.confirmLoading = false
        } else {
          var params = {
            password: values['password'],
            newPassword: values['newPassword']
          }
          this.postData(params)
        }
      })
    },
    checkNewPassword (rule, value, callback) {
      const { getFieldValue } = this.form
      const password = getFieldValue('newPassword')
      if (value !== password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    },
    // 提交数据
    postData (params) {
      accountService.modifyPwd(params).then(res => {
        this.confirmLoading = false
        if (res.code === 0) {
          const parent = this
          this.$message.success('修改成功,请使用新密码重新登录', 2, () => {
            parent.confirmLoading = false
            parent.Logout({}).then(() => {
              window.location.reload()
            }).catch(err => {
              parent.$message.error({
                title: '错误',
                description: err.message
              })
            })
          })
        } else {
          this.$message.error(res.msg)
        }
      }).catch(error => {
        console.log(error)
        this.confirmLoading = false
        this.$message.error('服务器繁忙')
      })
    }
  }
}
</script>
