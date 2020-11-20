<template>
  <div style="padding:20px;background:white;">
    <a-spin :spinning="spinning">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="签到积分奖励" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['signScore', { rules: [{ required: true, message: '请填写签到积分奖励!' }] }]"
          />
        </a-form-item>
        <a-form-item label="第一次点赞心情奖励积分" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['moodScore', { rules: [{ required: true, message: '请填写第一次点赞心情奖励积分!' }] }]"
          />
        </a-form-item>
        <a-form-item label="第一次点赞视频奖励积分" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['videoScore', { rules: [{ required: true, message: '请填写第一次点赞视频奖励积分!' }] }]"
          />
        </a-form-item>
        <a-form-item label="第一次点赞主题奖励积分" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['themeScore', { rules: [{ required: true, message: '请填写第一次点赞主题奖励积分!' }] }]"
          />
        </a-form-item>
        <a-form-item label="每月连续超过十天签到（每月重置）" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['monthTenScore', { rules: [{ required: true, message: '请填写每月连续超过十天签到（每月重置）!' }] }]"
          />
        </a-form-item>
        <a-form-item label="单个心情超过10个人点赞发布用户" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['moodLikesScore', { rules: [{ required: true, message: '请填写单个心情超过10个人点赞发布用户!' }] }]"
          />
        </a-form-item>
        <a-form-item label="每日首次发布图片区内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['moodAddScore', { rules: [{ required: true, message: '请填写每日首次发布图片区内容!' }] }]"
          />
        </a-form-item>
        <a-form-item label="每次回复超过5个字" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['replayScore', { rules: [{ required: true, message: '请填写每次回复超过5个字!' }] }]"
          />
        </a-form-item>
        <a-form-item label="每日首次分享加积分" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['shareScore', { rules: [{ required: true, message: '请填写每日首次分享加积分!' }] }]"
          />
        </a-form-item>
        <a-form-item label="机构预约扣除积分" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['makeMechanismScore', { rules: [{ required: true, message: '请填写机构预约扣除积分!' }] }]"
          />
        </a-form-item>
        <a-form-item label="打赏扣除的积分" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['rewardDeductScore', { rules: [{ required: true, message: '请填写打赏扣除的积分!' }] }]"
          />
        </a-form-item>
        <a-form-item label="打赏奖励的积分" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['rewardScore', { rules: [{ required: true, message: '请填写打赏奖励的积分!' }] }]"
          />
        </a-form-item>
        <a-form-item label="为机构优秀老师撰写一篇专题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['teacherComposeScore', { rules: [{ required: true, message: '请填写为机构优秀老师撰写一篇专题!' }] }]"
          />
        </a-form-item>
        <a-form-item label="为机构优秀学生撰写一篇专题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['studentComposeScore', { rules: [{ required: true, message: '请填写为机构优秀学生撰写一篇专题!' }] }]"
          />
        </a-form-item>
        <a-form-item label="教师增加10热度使用积分" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['heatScore', { rules: [{ required: true, message: '请填写为教师增加10热度使用的积分!' }] }]"
          />
        </a-form-item>
        <a-form-item label="编辑完成" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-button type="primary" html-type="submit">
            提交
          </a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
import { findSettingConfig, updateSettingConfig } from '@/api/manage'
export default {
  name: 'Workplace',
  components: {
  },
  data () {
    return {
      spinning: false,
      labelCol: { lg: { span: 5 }, sm: { span: 17 } },
      wrapperCol: { lg: { span: 17 }, sm: { span: 10 } },
      data: null,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {
    this.findSettingConfig()
  },
  methods: {
    findSettingConfig () {
      this.spinning = true
      findSettingConfig().then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data
          this.form.setFieldsValue({
            signScore: res.data.signScore,
            moodScore: res.data.moodScore,
            videoScore: res.data.videoScore,
            themeScore: res.data.themeScore,
            monthTenScore: res.data.monthTenScore,
            moodLikesScore: res.data.moodLikesScore,
            moodAddScore: res.data.moodAddScore,
            replayScore: res.data.replayScore,
            shareScore: res.data.shareScore,
            makeMechanismScore: res.data.makeMechanismScore,
            rewardDeductScore: res.data.rewardDeductScore,
            rewardScore: res.data.rewardScore,
            teacherComposeScore: res.data.teacherComposeScore,
            studentComposeScore: res.data.studentComposeScore,
            heatScore: res.data.heatScore
          })
        }
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.data.id
          updateSettingConfig(values).then(res => {
            if (res.code === 0) {
              this.$message.success(`编辑成功`)
              this.visible = false
            } else {
              this.$message.error(res.msg)
            }
          },
          error => {
            console.log('error', error)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
