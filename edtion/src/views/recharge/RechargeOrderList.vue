<template>
  <div style="padding:20px;background:white;">
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <img slot="avatarUrl" slot-scope="text" style="width: 50px;height: 50px;border-radius:5px;" :src="text"/>
        <span slot="status" slot-scope="text">
          <a-tag color="red" v-if="text === 0">
            未支付
          </a-tag>
          <a-tag color="green" v-if="text === 1">
            已支付
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
import { findRechargeOrderList } from '@/api/manage'
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
        dataIndex: 'title',
        title: '标题',
        key: 'title'
      },
      {
        dataIndex: 'score',
        title: '兑换积分',
        key: 'score'
      },
      {
        dataIndex: 'giveScore',
        title: '赠送积分',
        key: 'giveScore'
      },
      {
        dataIndex: 'payMoney',
        title: '金额',
        key: 'payMoney'
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
      }],
      data: []
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {
    this.findRechargeOrderList()
  },
  methods: {
    findRechargeOrderList () {
      this.spinning = true
      findRechargeOrderList(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.list
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findRechargeOrderList()
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber - 1
      this.findRechargeOrderList()
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
