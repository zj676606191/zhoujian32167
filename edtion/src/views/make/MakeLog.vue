<template>
  <div style="padding:20px;background:white;">
    <a-spin :spinning="spinning">
      <a-select
        placeholder="请选择工作人员"
        @change="updatePersonnel($event)"
        style="width:300px;margin-bottom:10px;"
      >
        <a-select-option
          value=""
        > 查询全部</a-select-option>
        <a-select-option
          v-for="(dataPro,index) in personnelList"
          :key="index"
          :value="dataPro.id"
        > {{ dataPro.nickName }}</a-select-option>
      </a-select>
      <a-range-picker style="float:right" @change="onChangeDate" />
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <img slot="avatarUrl" slot-scope="text" style="width: 50px;height: 50px;border-radius:5px;" :src="text"/>
        <span slot="flag" slot-scope="text">
          <a-tag color="red" v-if="text === 0">
            未查看
          </a-tag>
          <a-tag color="green" v-if="text === 1">
            已查看
          </a-tag>
        </span>
        <span slot="gmtCreate" slot-scope="text">
          {{ formatDate(text,true) }}
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
import { pageMechanismMakeLogVo, findPersonnelUser } from '@/api/manage'
export default {
  name: 'Workplace',
  components: {
  },
  data () {
    return {
      spinning: false,
      personnelList: [],
      queryData: {
        pageNum: 0,
        pageSize: 10
      },
      total: 0,
      columns: [{
        title: '头像',
        dataIndex: 'avatarUrl',
        key: 'avatarUrl',
        scopedSlots: { customRender: 'avatarUrl' }
      }, {
        title: '姓名',
        dataIndex: 'nickName',
        key: 'nickName'
      },
      {
        dataIndex: 'mechanismName',
        title: '机构名称',
        key: 'mechanismName'
      },
      {
        dataIndex: 'name',
        title: '预约人',
        key: 'name'
      },
      {
        dataIndex: 'phone',
        title: '预约电话',
        key: 'phone'
      },
      {
        dataIndex: 'gmtCreate',
        title: '预约时间',
        key: 'gmtCreate',
        scopedSlots: { customRender: 'gmtCreate' }
      },
      {
        title: '是否查看',
        key: 'flag',
        dataIndex: 'flag',
        scopedSlots: { customRender: 'flag' }
      }],
      data: []
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {
    this.pageMechanismMakeLogVo()
    this.findPersonnelUser()
  },
  methods: {
    onChangeDate (date, dateString) {
      console.log(date.length)
      if (date.length === 0) {
        this.queryData.beginTime = null
        this.queryData.endTime = null
      } else {
        this.queryData.beginTime = date[0]._d
        this.queryData.endTime = date[1]._d
      }
      this.pageMechanismMakeLogVo()
    },
    findPersonnelUser () {
      this.personnelList = []
      findPersonnelUser().then(res => {
        if (res.code === 0) {
          this.personnelList = res.data
        }
      },
      error => {
        console.log('error', error)
      })
    },
    updatePersonnel (e) {
      var personnelId = e
      if (e === '') {
        personnelId = null
      }
      this.queryData.personnelId = personnelId
      this.pageMechanismMakeLogVo()
    },
    pageMechanismMakeLogVo () {
      this.spinning = true
      pageMechanismMakeLogVo(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.list
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.pageMechanismMakeLogVo()
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber
      this.pageMechanismMakeLogVo()
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
