<template>
  <div>
    <a-modal
      title="编辑礼品"
      :width="900"
      :visible="visible"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancelModal"
    >

      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            action="https://boss.value-education.com/api/fileUpload"
            list-type="picture-card"
            :file-list="fileImage"
            @change="handleChange"
          >
            <div v-if="fileImage.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传图片
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
        <a-form-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['title', { rules: [{ required: true, message: '请填写标题!' }] }]"
          />
        </a-form-item>
        <a-form-item label="兑换积分" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['score', { rules: [{ required: true, message: '请填写兑换积分!' }] }]"
          />
        </a-form-item>
        <a-form-item label="兑换间隔天数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['day', { rules: [{ required: true, message: '请填写兑换间隔天数!' }] }]"
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
import { updateGift, findSingleGift } from '@/api/manage'
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
      this.findSingleGift()
    },
    findSingleGift () {
      findSingleGift({ id: this.id }).then(res => {
        if (res.code === 0) {
          this.singleData = res.data
          if (this.singleData.image !== null) {
            this.fileImage[0].url = this.singleData.image
          }
          this.status = this.singleData.status
          this.form.setFieldsValue({
            title: this.singleData.title,
            score: this.singleData.score,
            day: this.singleData.day
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
          values.image = ''
          this.fileImage.forEach(function (v) {
            values.image = v.response === undefined ? v.url : v.response.data
          })
          values.id = this.id
          values.status = this.status
          updateGift(values).then(res => {
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
