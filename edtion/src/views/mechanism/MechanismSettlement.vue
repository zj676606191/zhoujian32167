<template>
  <div style="padding:20px;background:white;">
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <span slot="image" slot-scope="text">
          <img v-for="(item,index) in JSON.parse(text)" :key="index" :src="item" style="width: 64px;border-radius:3px;margin-right:5px;"/>
        </span>
        <span slot="flag" slot-scope="text">
          <a-tag color="#87d068" v-if="text===1">
            已处理
          </a-tag>
          <a-tag color="#f50" v-if="text===0">
            未处理
          </a-tag>
        </span>
        <span slot="gmtCreate" slot-scope="text">
          {{ formatDate(text,true) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button type="dashed" v-if="record.flag === 0" @click="updateMechanismSettlementFlag(record.id)">
            修改已处理
          </a-button>
          <a-button type="dashed" v-if="record.flag === 1" @click="updateMechanismSettlementFlag(record.id)">
            修改为未处理
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
import { findMechanismSettlementList, updateMechanismSettlementFlag } from '@/api/manage'
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
          title: '姓名',
          key: 'name'
        },
        {
          dataIndex: 'phone',
          title: '电话',
          key: 'phone'
        },
        {
          dataIndex: 'mechanismName',
          title: '机构名称',
          key: 'mechanismName'
        },
        {
          dataIndex: 'teacherNum',
          title: '教师数量',
          key: 'teacherNum'
        },
        {
          dataIndex: 'address',
          title: '地址',
          key: 'address'
        },
        {
          dataIndex: 'studentNum',
          title: '学生数量',
          key: 'studentNum'
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
    this.findMechanismSettlementList()
  },
  methods: {
    updateMechanismSettlementFlag (id) {
      var that = this
      this.$confirm({
        title: '确定要修改为此状态吗?',
        content: '友情提示',
        onOk () {
          updateMechanismSettlementFlag({ id: id }).then(res => {
            if (res.code === 0) {
              that.$message.success(`成功`)
              that.findMechanismSettlementList()
            } else {
              that.$message.error(res.msg)
            }
          })
        },
        onCancel () {}
      })
    },
    findMechanismSettlementList () {
      this.spinning = true
      findMechanismSettlementList(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.records
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findMechanismSettlementList()
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber
      this.findMechanismSettlementList()
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
