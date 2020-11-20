<template>
  <div>
    <a-modal
      title="添加充值套餐"
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
        <a-form-item label="充值金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['payMoney', { rules: [{ required: true, message: '请填写充值金额!' }] }]"
          />
        </a-form-item>
        <a-form-item label="兑换积分" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['score', { rules: [{ required: true, message: '请填写兑换积分!' }] }]"
          />
        </a-form-item>
        <a-form-item label="额外赠送积分" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['giveScore', { rules: [{ required: true, message: '请填写额外赠送积分!' }] }]"
          />
        </a-form-item>
        <a-form-item label="是否显示" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-model="status" @change="onChangeStatus">
            <a-radio :value="0">
              显示
            </a-radio>
            <a-radio :value="1">
              停用
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { addRecharge } from '@/api/manage'
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
    onChangeStatus (e) {
      this.status = e.target.value
    },
    showModal () {
      this.visible = true
      this.status = 0
      this.form.setFieldsValue({
        title: '',
        payMoney: 0,
        score: 0,
        giveScore: 0
      })
    },
    handleOk (e) {
      const {
        form: { validateFields }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log(values)
          values.status = this.status
          this.confirmLoading = true
          addRecharge(values).then(res => {
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
