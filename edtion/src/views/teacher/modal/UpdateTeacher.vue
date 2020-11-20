<template>
  <div>
    <a-modal
      title="编辑教师"
      :width="900"
      :visible="visible"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancelModal"
    >

      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="教师头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
        <a-form-item label="教师名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请填写教师名称!' }] }]"
          />
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
        <a-form-item label="教师类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            style="width:80%;"
            placeholder="请选择教师类型"
            v-decorator="['typeId',{rules: [{required: true, message: '请选择教师类型！'}]}]"
            mode="multiple"
            :allowClear="true"
          >
            <a-select-option
              v-for="(data,index) in this.mechanismTypeList"
              :key="index"
              :value="data.id"
            > {{ data.typeName }} </a-select-option>
          </a-select>
          <a-button type="primary" @click="$refs.addMechanismType.showModal()" style="margin-left:1%;width:19%;">
            <a-icon type="plus" /> 添加类型
          </a-button>
        </a-form-item>
        <a-form-item label="热度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            style="width:100%;"
            v-decorator="['heat', { rules: [{ required: true, message: '请填写热度!' }] }]"
          />
        </a-form-item>
        <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['phone', { rules: [{ required: true, message: '请填写教师的手机号码!' }] }]"
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
        <a-form-item label="标签" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-tag :closable="true" v-for="(data,index) in tags" :key="index" color="green" @close="handleClose($event, data)">
            {{ data }}
          </a-tag>
          <a-input
            v-if="inputVisible"
            ref="input"
            type="text"
            size="small"
            :style="{ width: '78px' }"
            :value="inputValue"
            @change="handleInputChange"
            @blur="handleInputConfirm"
            @keyup.enter="handleInputConfirm"
          />
          <a-tag style="background: #fff; borderStyle: dashed;" @click="showInput">
            <a-icon type="plus" /> 添加标签
          </a-tag>
        </a-form-item>
        <a-form-item label="粉丝量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            style="width:100%;"
            v-decorator="['fans', { rules: [{ required: true, message: '请填写粉丝量!' }] }]"
          />
        </a-form-item>
        <a-form-item label="介绍" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea placeholder="请填写教师介绍" v-model="introduce" />
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
    <add-mechanism-type ref="addMechanismType" @refreshData="refreshData"></add-mechanism-type>
  </div>
</template>
<script>
import { updateTeacher, findSingleTeacher, findAllMechanism, findAllMechanismType } from '@/api/manage'
import AddMechanismType from '@/views/setting/modal/AddMechanismType'
export default {
  components: {
    AddMechanismType
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
      fileList: [],
      id: null,
      introduce: '',
      singleData: null,
      formLayout: 'horizontal',
      mechanismTypeList: [],
      inputVisible: false,
      inputValue: '',
      tags: [],
      sex: 0,
      mechanismList: [],
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    onChangeSex (e) {
      this.sex = e.target.value
      console.log('radio checked', e.target.value)
    },
    handleInputChange (e) {
      this.inputValue = e.target.value
    },
    handleInputConfirm () {
      const inputValue = this.inputValue
      if (inputValue && this.tags.indexOf(inputValue) === -1) {
        this.tags.push(inputValue)
      } else {
        this.$message.info(`该标签已存在`)
      }
      Object.assign(this, {
        inputVisible: false,
        inputValue: ''
      })
    },
    findAllMechanismType () {
      this.mechanismTypeList = []
      findAllMechanismType().then(res => {
        if (res.code === 0) {
          this.mechanismTypeList = res.data
        }
      },
      error => {
        console.log('error', error)
      })
    },
    handleClose (e, removedTag) {
      e.preventDefault()
      const tags = this.tags.filter(tag => tag !== removedTag)
      console.log(tags)
      this.tags = tags
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },
    showModal (id) {
      this.visible = true
      this.id = id
      this.findSingleTeacher()
      this.findAllMechanism()
      this.findAllMechanismType()
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
    findSingleTeacher () {
      this.fileList = []
      findSingleTeacher({ id: this.id }).then(res => {
        if (res.code === 0) {
          this.singleData = res.data
          if (this.singleData.image !== null) {
            this.fileImage[0].url = this.singleData.image
          }
          if (this.singleData.album !== null) {
            var that = this
            JSON.parse(this.singleData.album).forEach(function (v, k) {
              var imgObj = {
                uid: k,
                name: 'image.png',
                status: 'done',
                url: v
              }
              that.fileList.push(imgObj)
            })
          }
          this.introduce = this.singleData.introduce
          this.tags = JSON.parse(this.singleData.tags)
          this.sex = this.singleData.sex
          this.form.setFieldsValue({
            name: this.singleData.name,
            fans: this.singleData.fans,
            phone: this.singleData.phone,
            heat: this.singleData.heat,
            typeId: JSON.parse(this.singleData.typeId),
            mechanismIds: JSON.parse(this.singleData.mechanismIds)
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
          values.album = []
          this.fileImage.forEach(function (v) {
            values.image = v.response === undefined ? v.url : v.response.data
          })
          this.fileList.forEach(function (v) {
            values.album.push(v.response === undefined ? v.url : v.response.data)
          })
          values.album = JSON.stringify(values.album).toString()
          values.id = this.id
          values.introduce = this.introduce
          values.tags = JSON.stringify(this.tags).toString()
          values.typeId = JSON.stringify(values.typeId).toString()
          values.mechanismIds = JSON.stringify(values.mechanismIds).toString()
          values.sex = this.sex
          updateTeacher(values).then(res => {
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
    handleChangeAlbum ({ fileList }) {
      this.fileList = fileList
    },
    handleCancel () {
      this.previewVisible = false
    },
    handleSubmit () {
    },
    refreshData () {
      this.findAllMechanismType()
    }
  }
}
</script>
