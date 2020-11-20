<template>
  <div>
    <a-modal
      title="编辑学生"
      :width="900"
      :visible="visible"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancelModal"
    >

      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="学生头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            action="https://boss.value-education.com/api/fileUpload"
            list-type="picture-card"
            :file-list="fileImage"
            @change="handleChange"
          >
            <div v-if="fileImage.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传头像
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
        <a-form-item label="学生名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请填写学生名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="监护人手机" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['phone', { rules: [{ required: true, message: '请填写监护人手机号码!' }] }]"
          />
        </a-form-item>
        <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-model="sex" @change="onChangeSex">
            <a-radio :value="1">
              男
            </a-radio>
            <a-radio :value="0">
              女
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="所属机构" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            placeholder="请选择所属机构，可多选"
            v-decorator="['mechanismIds',{rules: [{required: true, message: '请选择所属机构，可多选！'}]}]"
            mode="multiple"
            :allowClear="true"
          >
            <a-select-option
              v-for="(dataPro,index) in this.mechanismList"
              :key="index"
              :value="dataPro.id"
            > {{ dataPro.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="关联老师" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            placeholder="请选择关联老师，可多选"
            v-decorator="['teacherIds',{rules: [{required: true, message: '请选择关联老师，可多选！'}]}]"
            mode="multiple"
            :allowClear="true"
          >
            <a-select-option
              v-for="(dataPro,index) in this.teacherList"
              :key="index"
              :value="dataPro.id"
            > {{ dataPro.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { updateStudent, findSingleStudent, findAllMechanism, findAllTeacher } from '@/api/manage'
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
      sex: 0,
      mechanismList: [],
      teacherList: [],
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    onChangeSex (e) {
      this.sex = e.target.value
      console.log('radio checked', e.target.value)
    },
    showModal (id) {
      this.visible = true
      this.id = id
      this.findSingleStudent()
      this.findAllMechanism()
      this.findAllTeacher()
    },
    findAllMechanism () {
      this.mechanismList = []
      findAllMechanism().then(res => {
        if (res.code === 0) {
          this.mechanismList = res.data
        }
      },
      error => {
        console.log('error', error)
      })
    },
    findAllTeacher () {
      this.teacherList = []
      findAllTeacher().then(res => {
        if (res.code === 0) {
          this.teacherList = res.data
        }
      },
      error => {
        console.log('error', error)
      })
    },
    findSingleStudent () {
      findSingleStudent({ id: this.id }).then(res => {
        if (res.code === 0) {
          this.singleData = res.data
          if (this.singleData.image !== null) {
            this.fileImage[0].url = this.singleData.image
          }
          this.sex = this.singleData.sex
          this.form.setFieldsValue({
            name: this.singleData.name,
            phone: this.singleData.phone,
            mechanismIds: JSON.parse(this.singleData.mechanismIds),
            teacherIds: JSON.parse(this.singleData.teacherIds)
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
          values.mechanismIds = JSON.stringify(values.mechanismIds).toString()
          values.teacherIds = JSON.stringify(values.teacherIds).toString()
          values.sex = this.sex
          updateStudent(values).then(res => {
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
