<template>
  <div>
    <a-modal
      title="编辑机构"
      :width="900"
      :visible="visible"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancelModal"
    >

      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="机构封面" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
        <a-form-item label="机构名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请填写机构名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="机构类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            style="width:80%;"
            placeholder="请选择机构类型"
            v-decorator="['typeId',{rules: [{required: true, message: '请选择机构类型！'}]}]"
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
        <a-form-item label="机构等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            placeholder="请选择机构等级"
            v-decorator="['grade',{rules: [{required: true, message: '请选择机构等级！'}]}]"
          >
            <a-select-option value="1">普通机构 </a-select-option>
            <a-select-option value="2">连锁机构 </a-select-option>
            <a-select-option value="3">工作室 </a-select-option>
            <a-select-option value="4">特殊机构 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="视频广告" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            action="https://boss.value-education.com/api/fileUpload"
            :multiple="true"
            :file-list="fileListVideo"
            @change="handleChangeVideo"
          >
            <a-button> <a-icon type="upload" /> 上传视频 </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="地区选择" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-cascader
            :options="options"
            v-decorator="['region', {rules: [{ required: true, message: '请选择地区'}],initialValue: ['北京市|110000','北京市市辖区|110100','东城区|110101']}]"
          />
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
        <a-form-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-model="keyword"
            v-decorator="['address', { rules: [{ required: true, message: '请填写机构地址!' }] }]"
          />
        </a-form-item>
        <a-form-item label="经纬度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <baidu-map
            :scroll-wheel-zoom="true"
            @ready="handler"
            @click="getPoint"
            :center="center"
            :zoom="zoom"
            style="width:100%;height:300px;"
          >
            <bm-marker @dragging="draggingMethod" :position="{lng: center.lng, lat: center.lat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
            </bm-marker>
            <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location" zoom="12.8" style="display: none"></bm-local-search>
          </baidu-map>
          <a-input
            style="width:49%;"
            addon-before="纬度"
            v-decorator="['latitude', { rules: [{ required: true, message: '请填写纬度!' }] }]"
          />
          <span style="width:1%;">~</span>
          <a-input
            style="width:49%;"
            addon-before="经度"
            v-decorator="['longitude', { rules: [{ required: true, message: '请填写经度!' }] }]"
          />
        </a-form-item>
        <a-form-item label="手机" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['phone', { rules: [{ required: true, message: '请填写手机!' }] }]"
          />
        </a-form-item>
        <a-form-item label="座机" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['mobile', { rules: [{ required: true, message: '请填写座机!' }] }]"
          />
        </a-form-item>
        <a-form-item label="介绍" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea placeholder="请填写机构介绍" v-model="introduce" />
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
import { updateMechanism, findSingleMechanism, findAllMechanismType } from '@/api/manage'
import { BaiduMap, BmMarker, BmLocalSearch } from 'vue-baidu-map'
import AddMechanismType from '@/views/setting/modal/AddMechanismType'
import { address } from '@/utils/address'
export default {
  components: {
    BaiduMap,
    BmMarker,
    BmLocalSearch,
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
      fileListVideo: [
        {
          uid: '-1',
          name: 'advert.mp4',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
      ],
      options: address,
      fileList: [],
      mechanismTypeList: [],
      id: null,
      introduce: '',
      singleData: null,
      formLayout: 'horizontal',
      center: { lng: 0, lat: 0 },
      zoom: 3,
      location: '',
      keyword: '',
      inputVisible: false,
      inputValue: '',
      tags: [],
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    handleChangeVideo (info) {
      let fileList = [...info.fileList]

      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-2)

      // 2. read from response and show file link
      fileList = fileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url
        }
        return file
      })
      this.fileListVideo = fileList
    },
    handleInputChange (e) {
      this.inputValue = e.target.value
    },
    handleInputConfirm () {
      console.log(this.tags)
      const inputValue = this.inputValue
      if (inputValue && this.tags.indexOf(inputValue) === -1) {
        this.tags.push(inputValue)
      } else {
        this.$message.info(`该标签已存在`)
      }
      console.log(this.tags)
      Object.assign(this, {
        inputVisible: false,
        inputValue: ''
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
    draggingMethod (e) {
      console.log(e)
      this.form.setFieldsValue({
        latitude: e.point.lat,
        longitude: e.point.lng
      })
    },
    getPoint (e) {
      console.log(e)
      this.form.setFieldsValue({
        latitude: e.point.lat,
        longitude: e.point.lng
      })
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
    },
    handler ({ BMap, map }) {
      console.log(BMap, map)
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = 15
    },
    showModal (id) {
      this.visible = true
      this.id = id
      this.findSingleMechanism()
      this.findAllMechanismType()
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
    findSingleMechanism () {
      this.fileList = []
      findSingleMechanism({ id: this.id }).then(res => {
        if (res.code === 0) {
          this.singleData = res.data
          if (this.singleData.advertVideo !== null) {
            this.fileListVideo[0].url = this.singleData.advertVideo
          } else {
            this.fileListVideo = []
          }
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
          if (this.singleData.tags !== null) {
            this.tags = JSON.parse(this.singleData.tags)
          }
          this.introduce = this.singleData.introduce
          this.form.setFieldsValue({
            name: this.singleData.name,
            latitude: parseFloat(this.singleData.latitude) + 0.0060,
            longitude: parseFloat(this.singleData.longitude) + 0.0065,
            phone: this.singleData.phone,
            mobile: this.singleData.mobile,
            region: JSON.parse(this.singleData.region),
            grade: this.singleData.grade + '',
            typeId: JSON.parse(this.singleData.typeId),
            address: this.singleData.address
          })
          this.center.lng = parseFloat(this.singleData.longitude) + 0.0065
          this.center.lat = parseFloat(this.singleData.latitude) + 0.0060
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
          values.advertVideo = ''
          values.album = []
          this.fileImage.forEach(function (v) {
            values.image = v.response === undefined ? v.url : v.response.data
          })
          this.fileList.forEach(function (v) {
            values.album.push(v.response === undefined ? v.url : v.response.data)
          })
          this.fileListVideo.forEach(function (v) {
            values.advertVideo = v.response === undefined ? v.url : v.response.data
          })
          values.album = JSON.stringify(values.album).toString()
          values.region = JSON.stringify(values.region).toString()
          values.id = this.id
          values.tags = JSON.stringify(this.tags).toString()
          values.typeId = JSON.stringify(values.typeId).toString()
          values.introduce = this.introduce
          values.latitude = values.latitude - 0.0060
          values.longitude = values.longitude - 0.0065
          updateMechanism(values).then(res => {
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
