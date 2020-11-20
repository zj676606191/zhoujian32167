<template>
  <div>
    <a-modal
      title="编辑充值套餐"
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
              隐藏
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { updateRecharge, findSingleRecharge } from '@/api/manage'
export default {
  components: {
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      previewVisible: false,
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
      this.findSingleRecharge()
    },
    findSingleRecharge () {
      findSingleRecharge({ id: this.id }).then(res => {
        if (res.code === 0) {
          this.singleData = res.data
          this.status = this.singleData.status
          this.form.setFieldsValue({
            title: this.singleData.title,
            score: this.singleData.score,
            giveScore: this.singleData.giveScore,
            payMoney: this.singleData.payMoney
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
          values.status = this.status
          updateRecharge(values).then(res => {
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
    handleChange ({ fileList }) {
      this.fileImage = fileList
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleSubmit () {
    }
  }
}
</script>
