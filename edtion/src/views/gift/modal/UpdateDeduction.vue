<template>
  <div>
    <a-modal
      title="编辑抵扣学费的套餐"
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
import { updateDeduction, findSingleDeduction } from '@/api/manage'
export default {
  components: {
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      labelCol: { lg: { span: 3 }, sm: { span: 17 } },
      wrapperCol: { lg: { span: 17 }, sm: { span: 10 } },
      id: null,
      singleData: null,
      formLayout: 'horizontal',
      status: 0,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    onChangeStatus (e) {
      this.status = e.target.value
      console.log('radio checked', e.target.value)
    },
    showModal (id) {
      this.visible = true
      this.id = id
      this.findSingleDeduction()
    },
    findSingleDeduction () {
      findSingleDeduction({ id: this.id }).then(res => {
        if (res.code === 0) {
          this.singleData = res.data
          this.form.setFieldsValue({
            title: this.singleData.title,
            payMoney: this.singleData.payMoney,
            score: this.singleData.score
          })
        }
      })
    },
    handleOk (e) {
      // this.confirmLoading = true
      const {
        form: { validateFields }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.id
          updateDeduction(values).then(res => {
            if (res.code === 0) {
              this.$message.success(`编辑成功`)
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
