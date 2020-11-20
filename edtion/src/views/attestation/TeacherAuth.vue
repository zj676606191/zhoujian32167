<template>
  <div style="padding:20px;background:white;">
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <span slot="mate" slot-scope="text, record">
          <a-tag color="red" v-if="record.mate === 0">
            未匹配到
          </a-tag>
          <a-tag color="green" v-else>
            匹配到
          </a-tag>
        </span>
        <span slot="flag" slot-scope="text, record">
          <a-tag color="red" v-if="record.flag === 0">
            未处理
          </a-tag>
          <a-tag color="green" v-if="record.flag === 1">
            已处理
          </a-tag>
          <a-tag color="green" v-if="record.flag === 2">
            匹配失败，废弃认证
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <span v-if="record.flag === 0">
            <a-select
              placeholder="请选择老师"
              style="margin-right:10px;width:150px;"
              v-model="record.teacherId"
            >
              <a-select-option
                :value="record.teacherId"
              > 请选择认证老师</a-select-option>
              <a-select-option
                v-for="(dataPro,index) in teacherList"
                :key="index"
                :value="dataPro.id"
              > {{ dataPro.name }}</a-select-option>
            </a-select>
            <a-button type="dashed" v-if="record.mate === 1" @click="certification(record.id)" style="margin-right:10px;">
              <a-icon type="edit" /> 认证通过
            </a-button>
            <a-button type="dashed" v-if="record.mate === 0" @click="headCertification(record)" style="margin-right:10px;">
              <a-icon type="edit" /> 手动匹配通过
            </a-button>
          </span>
          <span v-else>

            <span v-for="(dataPro,index) in teacherList" :key="index">
              <a-tag v-if="dataPro.id === record.teacherId" color="#87d068">
                已认证为：{{ dataPro.name }}
              </a-tag>
            </span>
            <a-select
              placeholder="请选择老师"
              style="margin-right:10px;width:150px;"
              v-model="record.teacherId"
            >
              <a-select-option
                v-for="(dataPro,index) in teacherList"
                :key="index"
                :value="dataPro.id"
              > {{ dataPro.name }}</a-select-option>
            </a-select>
            <a-button type="dashed" @click="headCertification(record)" style="margin-right:10px;">
              <a-icon type="edit" /> 更改提交
            </a-button>
          </span>
        </span>
      </a-table>
      <template>
        <a-pagination
          style="margin:20px auto;"
          v-if="data.length>0"
          :defaultCurrent="1"
          :total="total"
          :pageSize="queryData.pageSize"
          @change="onChangePage"
        />
      </template>
    </a-spin>
  </div>
</template>

<script>
import { findTeacherAuthPage, teacherCertificationPassed, headCertificationPassed, findAllTeacher } from '@/api/manage'
export default {
  name: 'Workplace',
  components: {
  },
  data () {
    return {
      spinning: false,
      queryData: {
        pageNum: 0,
        pageSize: 10
      },
      total: 0,
      columns: [
        {
          dataIndex: 'name',
          title: '教师名称',
          key: 'name'
        },
        {
          title: '电话',
          key: 'phone',
          dataIndex: 'phone'
        },
        {
          title: '机构',
          key: 'mechanismName',
          dataIndex: 'mechanismName'
        },
        {
          title: '是否匹配到',
          key: 'mate',
          dataIndex: 'mate',
          scopedSlots: { customRender: 'mate' }
        },
        {
          title: '是否已处理',
          key: 'flag',
          dataIndex: 'flag',
          scopedSlots: { customRender: 'flag' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }],
      data: [],
      teacherList: []
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {
    this.findTeacherAuthPage()
    this.findAllTeacher()
  },
  methods: {
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
    certification (id) {
      var that = this
      this.$confirm({
        title: '确定要认证通过吗?',
        content: '友情提示',
        onOk () {
          teacherCertificationPassed({ id: id }).then(res => {
            if (res.code === 0) {
              that.$message.success(`成功`)
              that.findTeacherAuthPage()
              that.findAllAuthTeacher()
            } else {
              that.$message.error(res.msg)
            }
          })
        },
        onCancel () {}
      })
    },
    headCertification (record) {
      console.log(record)
      if (record.teacherId === null) {
        this.$message.error(`请先选择老师`)
        return
      }
      var that = this
      this.$confirm({
        title: '确定要手动认证通过吗?',
        content: '友情提示',
        onOk () {
          headCertificationPassed({ id: record.id, teacherId: record.teacherId }).then(res => {
            if (res.code === 0) {
              that.$message.success(`成功`)
              that.findTeacherAuthPage()
              that.findAllTeacher()
            } else {
              that.$message.error(res.msg)
            }
          })
        },
        onCancel () {}
      })
    },
    findTeacherAuthPage () {
      this.spinning = true
      findTeacherAuthPage(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.records
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findTeacherAuthPage()
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber - 1
      this.findTeacherAuthPage()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
