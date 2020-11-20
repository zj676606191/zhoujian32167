<template>
  <div>
    <a-modal
      title="添加主题"
      :width="900"
      :visible="visible"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancelModal"
    >

      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="封面" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            action="https://boss.value-education.com/api/fileUpload"
            list-type="picture-card"
            :file-list="fileImage"
            @change="handleChange"
          >
            <div v-if="fileImage.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传封面
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
        <a-form-item label="主题类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            placeholder="请选择主题类型"
            v-decorator="['typeId',{rules: [{required: true, message: '请选择主题类型！'}]}]"
            :allowClear="true"
          >
            <a-select-option
              v-for="(dataPro,index) in this.themeTypeList"
              :key="index"
              :value="dataPro.id"
            > {{ dataPro.typeName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="内容" :labelCol="{lg: {span: 3}, sm: {span: 17}}" :wrapperCol="{lg: {span: 17}, sm: {span: 5}}" >
          <quill-editor
            v-decorator="['content', {rules: [{required: true, message: '请编辑内容'}]}]"
            name="content"
            ref="myQuillEditor"
            :options="quillOption">
          </quill-editor>
        </a-form-item>
        <a-form-item label="点赞量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            style="width:100%;"
            v-decorator="['likes', { rules: [{ required: true, message: '请填写点赞量!' }] }]"
          />
        </a-form-item>
        <a-form-item label="所属机构" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            placeholder="请选择所属机构"
            v-decorator="['mechanismId',{rules: [{required: false, message: '请选择所属机构！'}]}]"
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
            placeholder="请选择关联老师"
            v-decorator="['teacherId',{rules: [{required: false, message: '请选择关联老师！'}]}]"
            :allowClear="true"
          >
            <a-select-option
              v-for="(dataPro,index) in this.teacherList"
              :key="index"
              :value="dataPro.id"
            > {{ dataPro.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="关联学生" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            placeholder="请选择关联学生"
            v-decorator="['studentId',{rules: [{required: false, message: '请选择关联学生！'}]}]"
            :allowClear="true"
          >
            <a-select-option
              v-for="(dataPro,index) in this.studentList"
              :key="index"
              :value="dataPro.id"
            > {{ dataPro.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="相册" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            action="https://boss.value-education.com/api/fileUpload"
            list-type="picture-card"
            :file-list="fileList"
            @change="handleChangeAlbum"
          >
            <div v-if="fileList.length < 5">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传相册图片
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { addTheme, findAllMechanism, findAllTeacher, findAllStudent, findAllThemeType } from '@/api/manage'
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import quillConfig from '@/components/Editor/quill-config.js'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      labelCol: { lg: { span: 3 }, sm: { span: 17 } },
      wrapperCol: { lg: { span: 17 }, sm: { span: 10 } },
      visible: false,
      confirmLoading: false,
      previewVisible: false,
      previewImage: '',
      fileImage: [],
      fileList: [],
      quillOption: quillConfig,
      formLayout: 'horizontal',
      sex: 0,
      mechanismList: [],
      teacherList: [],
      studentList: [],
      themeTypeList: [],
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  created () {
  },
  methods: {
    onChangeSex (e) {
      this.sex = e.target.value
    },
    showModal () {
      this.visible = true
      this.fileImage = []
      this.sex = 0
      this.form.setFieldsValue({
        name: '',
        mechanismIds: []
      })
      this.findAllMechanism()
      this.findAllTeacher()
      this.findAllStudent()
      this.findAllThemeType()
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
    findAllStudent () {
      this.studentList = []
      findAllStudent().then(res => {
        if (res.code === 0) {
          this.studentList = res.data
        }
      },
      error => {
        console.log('error', error)
      })
    },
    findAllThemeType () {
      this.themeTypeList = []
      findAllThemeType().then(res => {
        if (res.code === 0) {
          this.themeTypeList = res.data
        }
      },
      error => {
        console.log('error', error)
      })
    },
    handleOk (e) {
      const {
        form: { validateFields }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log(values)
          values.image = ''
          values.album = []
          this.fileImage.forEach(function (v) {
            values.image = v.response.data
          })
          this.fileList.forEach(function (v) {
            values.album.push(v.response.data)
          })
          values.album = JSON.stringify(values.album).toString()
          this.confirmLoading = true
          values.content = values.content.html
          addTheme(values).then(res => {
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
    handleChange ({ fileList }) {
      this.fileImage = fileList
    },
    handleChangeAlbum ({ fileList }) {
      this.fileList = fileList
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleSubmit () {
    }
  }
}
</script>
