<template>
  <div style="padding:20px;background:white;">
    <a-button type="primary" @click="$refs.addRecharge.showModal()" style="margin-bottom:20px;">
      <a-icon type="plus" /> 添加充值套餐
    </a-button>
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <span slot="status" slot-scope="text">
          <a-tag color="green" v-if="text === 0">
            启用
          </a-tag>
          <a-tag color="red" v-if="text === 1">
            停用
          </a-tag>
        </span>
        <span slot="gmtCreate" slot-scope="text">
          {{ formatDate(text,true) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button type="dashed" @click="$refs.updateRecharge.showModal(record.id)" style="margin-right:10px;">
            <a-icon type="edit" /> 编辑
          </a-button>
          <a-button type="danger" v-if="record.status === 0" @click="delConfirm(record.id)">
            <a-icon type="delete" /> 停用
          </a-button>
          <a-button type="primary" v-if="record.status === 1" @click="delConfirm(record.id)">
            <a-icon type="check" /> 启用
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
    <add-recharge ref="addRecharge" @refreshData="refreshData"></add-recharge>
    <update-recharge ref="updateRecharge" @refreshData="refreshData"></update-recharge>
  </div>
</template>

<script>
import { findRechargeList, updateRechargeStatus } from '@/api/manage'
import AddRecharge from '@/views/recharge/modal/AddRecharge'
import UpdateRecharge from '@/views/recharge/modal/UpdateRecharge'
export default {
  name: 'Workplace',
  components: {
    AddRecharge,
    UpdateRecharge
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
        dataIndex: 'title',
        title: '标题',
        key: 'title'
      },
      {
        dataIndex: 'payMoney',
        title: '支付金额',
        key: 'payMoney'
      },
      {
        dataIndex: 'score',
        title: '充值积分',
        key: 'score'
      },
      {
        dataIndex: 'giveScore',
        title: '额外赠送积分',
        key: 'giveScore'
      },
      {
        dataIndex: 'gmtCreate',
        title: '添加时间',
        key: 'gmtCreate',
        scopedSlots: { customRender: 'gmtCreate' }
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' }
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
    this.findRechargeList()
  },
  methods: {
    findRechargeList () {
      this.spinning = true
      findRechargeList(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.records
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findRechargeList()
    },
    delConfirm (id) {
      var that = this
      this.$confirm({
        title: '确定停用该充值套餐吗?',
        content: '友情提示',
        onOk () {
          updateRechargeStatus({ id: id }).then(res => {
            if (res.code === 0) {
              that.findRechargeList()
            }
          })
        },
        onCancel () {}
      })
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber
      this.findRechargeList()
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
