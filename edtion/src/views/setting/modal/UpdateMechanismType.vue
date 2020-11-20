<template>
  <div>
    <a-modal
      title="编辑机构类型"
      :width="500"
      :visible="visible"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancelModal"
    >

      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="类型图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            action="https://boss.value-education.com/api/fileUpload"
            list-type="picture-card"
            :file-list="fileImage"
            @change="handleChange"
          >
            <div v-if="fileImage.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传图标
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
        <a-form-item label="类型名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['typeName', { rules: [{ required: true, message: '请填写机构类型名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            style="width:100%;"
            v-decorator="['sortNum', { rules: [{ required: true, message: '请填写排序数!' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { updateMechanismType, findSingleMechanismType } from '@/api/manage'
export default {
  components: {
  },
  data () {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 17 } },
      wrapperCol: { lg: { span: 17 }, sm: { span: 10 } },
      visible: false,
      confirmLoading: false,
      previewVisible: false,
      previewImage: '',
      fileImage: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
      ],
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
      this.findSingleMechanismType()
    },
    findSingleMechanismType () {
      findSingleMechanismType({ id: this.id }).then(res => {
        if (res.code === 0) {
          if (res.data.icon !== null) {
            this.fileImage[0].url = res.data.icon
          }
          this.form.setFieldsValue({
            typeName: res.data.typeName,
            sortNum: res.data.sortNum
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
          values.icon = ''
          this.fileImage.forEach(function (v) {
            values.icon = v.response.data
          })
          updateMechanismType(values).then(res => {
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
