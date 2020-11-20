<template>
  <div style="padding:20px;background:white;">
    <a-spin :spinning="spinning">
      <div style="margin-bottom:20px;">
        <a-input style="width:30%;margin-right:10px;" placeholder="根据微信昵称搜索，请注意特殊符号" v-model="queryData.nickName"/>
        <a-button @click="searchClick" type="primary">
          根据微信昵称搜索，请注意特殊符号
        </a-button>
      </div>
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <span slot="avatarUrl" slot-scope="text">
          <img :src="text" style="width: 64px;border-radius:10px;"/>
        </span>
        <span slot="score" slot-scope="text, record">
          当前积分：<a-input-number v-model="record.score" :min="0" :max="9999999999" @change="onChangeScore(record)" />
        </span>
        <span slot="authMechanism" slot-scope="text, record">
          <a-select
            placeholder="请选择所属机构，可多选"
            :default-value="text===null?[]:JSON.parse(text)"
            mode="multiple"
            @change="updateMechanism($event,record)"
            style="width:150px;margin-right:10px;"
            :allowClear="true"
          >
            <a-select-option
              v-for="(dataPro,index) in mechanismList"
              :key="index"
              :value="dataPro.id"
            > {{ dataPro.name }}</a-select-option>
          </a-select>
        </span>
        <span slot="authTeacher" slot-scope="text, record">
          <a-select
            placeholder="请选择教师"
            :default-value="text===null?[]:text"
            @change="updateTeacher($event,record)"
            style="width:100px;margin-right:10px;"
          >
            <a-select-option
              value=""
            > 取消绑定</a-select-option>
            <a-select-option
              v-for="(dataPro,index) in teacherList"
              :key="index"
              :value="dataPro.id"
            > {{ dataPro.name }}</a-select-option>
          </a-select>
        </span>
        <span slot="grade" slot-scope="text, record">
          <a-select
            :default-value="text===null?[]:text+''"
            @change="updateGrade($event,record)"
            style="width:100px;margin-right:10px;"
          >
            <a-select-option value="1"> 普通用户</a-select-option>
            <a-select-option value="2"> 工作人员</a-select-option>
            <a-select-option value="3"> 管理员</a-select-option>
          </a-select>
        </span>
        <span slot="flag" slot-scope="text">
          <a-tag color="#f50" v-if="text===1">
            封禁
          </a-tag>
          <a-tag color="#87d068" v-if="text===0">
            正常
          </a-tag>
        </span>
        <span slot="gmtCreate" slot-scope="text">
          {{ formatDate(text,true) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button type="dashed" v-if="record.flag === 0" @click="updateUserFlag(record.id,1)">
            <a-icon type="del" /> 封禁
          </a-button>
          <a-button type="dashed" v-if="record.flag === 1" @click="updateUserFlag(record.id,0)">
            <a-icon type="del" /> 解封
          </a-button>
        </span>
      </a-table>
      <template>
        <a-pagination
          style="margin:20px auto;"
          v-if="data.length>0"
          :defaultCurrent="defaultCurrent"
          :total="total"
          :pageSize="queryData.pageSize"
          @change="onChangePage"
        />
      </template>
    </a-spin>
  </div>
</template>

<script>
import { findUserPage, updateUserFlag, updateUserGrade, findAllMechanism, findAllTeacher, updateUserAuthMechanism, updateUserAuthTeacher, updateUserScore } from '@/api/manage'
export default {
  name: 'Workplace',
  components: {
  },
  data () {
    return {
      spinning: false,
      defaultCurrent: 1,
      queryData: {
        pageNum: 0,
        nickName: '',
        pageSize: 10
      },
      total: 0,
      mechanismList: [],
      teacherList: [],
      columns: [
        {
          title: '头像',
          key: 'avatarUrl',
          dataIndex: 'avatarUrl',
          scopedSlots: { customRender: 'avatarUrl' }
        },
        {
          dataIndex: 'nickName',
          title: '用户',
          key: 'nickName'
        },
        {
          title: '手机号码',
          key: 'mobile',
          dataIndex: 'mobile'
        },
        {
          title: '积分',
          key: 'score',
          dataIndex: 'score',
          scopedSlots: { customRender: 'score' }
        },
        {
          title: '绑定的机构',
          key: 'authMechanism',
          dataIndex: 'authMechanism',
          scopedSlots: { customRender: 'authMechanism' }
        },
        {
          title: '绑定的教师',
          key: 'authTeacher',
          dataIndex: 'authTeacher',
          scopedSlots: { customRender: 'authTeacher' }
        },
        {
          title: '等级',
          key: 'grade',
          dataIndex: 'grade',
          scopedSlots: { customRender: 'grade' }
        },
        {
          title: '状态',
          key: 'flag',
          dataIndex: 'flag',
          scopedSlots: { customRender: 'flag' }
        },
        {
          title: '时间',
          key: 'gmtCreate',
          dataIndex: 'gmtCreate',
          scopedSlots: { customRender: 'gmtCreate' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }],
      data: []
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {
    this.findUserPage()
    this.findAllMechanism()
    this.findAllTeacher()
  },
  methods: {
    searchClick () {
      console.log(this.queryData)
      this.queryData.pageNum = 0
      this.findUserPage()
    },
    onChangeScore (record) {
      var valData = {
        id: record.id,
        score: record.score
      }
      updateUserScore(valData).then(res => {
        if (res.code === 0) {
          this.$message.success(`成功`)
        }
      },
      error => {
        console.log('error', error)
      })
    },
    updateMechanism (e, record) {
      console.log(e)
      console.log(record)
      var authMechanism = JSON.stringify(e).toString()
      if (e.length === 0) {
        authMechanism = null
      }
      var valData = {
        id: record.id,
        authMechanism: authMechanism
      }
      updateUserAuthMechanism(valData).then(res => {
        if (res.code === 0) {
          this.$message.success(`成功`)
          this.findAllMechanism()
          this.findUserPage()
        }
      },
      error => {
        console.log('error', error)
      })
    },
    updateTeacher (e, record) {
      console.log(e)
      console.log(record)
      var authTeacher = e
      if (e === '') {
        authTeacher = null
      }
      var valData = {
        id: record.id,
        authTeacher: authTeacher
      }
      updateUserAuthTeacher(valData).then(res => {
        if (res.code === 0) {
          this.$message.success(`成功`)
        } else {
          this.$message.error(res.msg)
          this.findUserPage()
        }
      },
      error => {
        console.log('error', error)
      })
    },
    updateGrade (e, record) {
      console.log(e)
      console.log(record)
      var valData = {
        id: record.id,
        grade: e
      }
      updateUserGrade(valData).then(res => {
        if (res.code === 0) {
          this.$message.success(`成功`)
        }
      },
      error => {
        console.log('error', error)
      })
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
    updateUserFlag (id, flag) {
      var that = this
      this.$confirm({
        title: '确定要修改为此状态吗?',
        content: '友情提示',
        onOk () {
          updateUserFlag({ id: id, flag: flag }).then(res => {
            if (res.code === 0) {
              that.$message.success(`成功`)
              that.findUserPage()
            } else {
              that.$message.error(res.msg)
            }
          })
        },
        onCancel () {}
      })
    },
    findUserPage () {
      this.data = []
      this.spinning = true
      findUserPage(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.records
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findUserPage()
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber
      this.defaultCurrent = pageNumber
      this.findUserPage()
    },
    formatDate (value, flg) {
      var date = new Date(value)
      var y = date.getFullYear()
      var MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      if (flg) {
        let h = date.getHours()
        h = h < 10 ? ('0' + h) : h
        let m = date.getMinutes()
        m = m < 10 ? ('0' + m) : m
        let s = date.getSeconds()
        s = s < 10 ? ('0' + s) : s
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
      }
      return y + '-' + MM + '-' + d
    }
  }
}
</script>

<style lang="less" scoped>

</style>
