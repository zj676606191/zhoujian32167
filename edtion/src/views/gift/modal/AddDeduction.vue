<template>
  <div>
    <a-modal
      title="添加积分抵扣学费套餐"
      :width="900"
      :visible="visible"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancelModal"
    >

      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['title', { rules: [{ required: true, message: '请填写标题!' }] }]"
          />
        </a-form-item>
        <a-form-item label="抵扣金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['payMoney', { rules: [{ required: true, message: '请填写抵扣金额!' }] }]"
          />
        </a-form-item>
        <a-form-item label="使用积分" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['score', { rules: [{ required: true, message: '请填写使用积分!' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { addDeduction } from '@/api/manage'
export default {
  components: {
  },
  data () {
    return {
      labelCol: { lg: { span: 3 }, sm: { span: 17 } },
      wrapperCol: { lg: { span: 17 }, sm: { span: 10 } },
      visible: false,
      confirmLoading: false,
      formLayout: 'horizontal',
      status: 0,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  created () {
  },
  methods: {
    showModal () {
      this.visible = true
      this.status = 0
      this.form.setFieldsValue({
        title: '',
        payMoney: 0,
        score: 0
      })
    },
    handleOk (e) {
      const {
        form: { validateFields }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log(values)
          this.confirmLoading = true
          addDeduction(values).then(res => {
            this.confirmLoading = false
            if (res.code === 0) {
              this.$message.success(`添加成功`)
              this.visible = false
              this.$emit('refreshData', values)
            } else {
              this.$message.error(res.msg)
            }
          },
          error => {
            console.log('error', error)
          })
        }
      })
    },
    handleCancelModal (e) {
      console.log('Clicked cancel button')
      this.visible = false
    },
    handleSubmit () {
    }
  }
}
</script>
