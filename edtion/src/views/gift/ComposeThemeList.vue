<template>
  <div style="padding:20px;background:white;">
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <span slot="type" slot-scope="text">
          <a-tag color="red" v-if="text === 'TEACHER'">
            教师主题
          </a-tag>
          <a-tag color="red" v-if="text === 'STUDENT'">
            学生主题
          </a-tag>
        </span>
        <span slot="gmtCreate" slot-scope="text">
          {{ formatDate(text,true) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a-tag color="red" v-if="record.status === 0">
            未审核
          </a-tag>
          <a-tag color="green" v-if="record.status === 1">
            已审核
          </a-tag>
          <a-tag color="orange" v-if="record.status === 2">
            已驳回
          </a-tag>
          <a-button type="primary" v-if="record.status===0" style="margin-right:10px;" @click="updateStatusConfirm(record.id,1)">
            <a-icon type="check" /> 审核
          </a-button>
          <a-button type="danger" v-if="record.status===0" @click="updateStatusConfirm(record.id,2)">
            <a-icon type="close-square" /> 驳回
          </a-button>
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
import { findComposeThemeList, updateComposeThemeStatus } from '@/api/manage'
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
      columns: [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        dataIndex: 'type',
        title: '类型',
        key: 'type',
        scopedSlots: { customRender: 'type' }
      },
      {
        dataIndex: 'score',
        title: '兑换积分',
        key: 'score'
      },
      {
        dataIndex: 'phone',
        title: '手机号码',
        key: 'phone'
      },
      {
        dataIndex: 'gmtCreate',
        title: '时间',
        key: 'gmtCreate',
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
    this.findComposeThemeList()
  },
  methods: {
    findComposeThemeList () {
      this.spinning = true
      findComposeThemeList(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.records
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findComposeThemeList()
    },
    updateStatusConfirm (id, status) {
      var that = this
      this.$confirm({
        title: '确定修改为该状态吗?',
        content: '友情提示',
        onOk () {
          updateComposeThemeStatus({ id: id, status: status }).then(res => {
            if (res.code === 0) {
              that.findComposeThemeList()
            }
          })
        },
        onCancel () {}
      })
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber
      this.findComposeThemeList()
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
