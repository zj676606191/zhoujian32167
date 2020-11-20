<template>
  <div>
    <a-modal
      title="编辑主题类型"
      :width="500"
      :visible="visible"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancelModal"
    >

      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="类型名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['typeName', { rules: [{ required: true, message: '请填写主题类型名称!' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { updateThemeType, findSingleThemeType } from '@/api/manage'
export default {
  components: {
  },
  data () {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 17 } },
      wrapperCol: { lg: { span: 17 }, sm: { span: 10 } },
      visible: false,
      confirmLoading: false,
      id: null,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  created () {
  },
  methods: {
    showModal (id) {
      this.visible = true
      this.id = id
      this.findSingleThemeType()
    },
    findSingleThemeType () {
      findSingleThemeType({ id: this.id }).then(res => {
        if (res.code === 0) {
          this.form.setFieldsValue({
            typeName: res.data.typeName
          })
        }
      })
    },
    handleOk (e) {
      const {
        form: { validateFields }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.id
          updateThemeType(values).then(res => {
            if (res.code === 0) {
              this.$message.success(`修改成功`)
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
      this.visible = false
    },
    handleSubmit () {
    }
  }
}
</script>
