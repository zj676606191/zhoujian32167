<template>
  <div style="padding:20px;background:white;">
    <a-button type="primary" @click="$refs.addDeduction.showModal()" style="margin-bottom:20px;">
      <a-icon type="plus" /> 添加抵扣学费的套餐
    </a-button>
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <span slot="action" slot-scope="text, record">
          <a-button type="dashed" @click="$refs.updateDeduction.showModal(record.id)" style="margin-right:10px;">
            <a-icon type="edit" /> 编辑
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
    <add-deduction ref="addDeduction" @refreshData="refreshData"></add-deduction>
    <update-deduction ref="updateDeduction" @refreshData="refreshData"></update-deduction>
  </div>
</template>

<script>
import { findDeductionList } from '@/api/manage'
import AddDeduction from '@/views/gift/modal/AddDeduction'
import UpdateDeduction from '@/views/gift/modal/UpdateDeduction'
export default {
  name: 'Workplace',
  components: {
    AddDeduction,
    UpdateDeduction
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
        title: '抵扣学费',
        key: 'payMoney'
      },
      {
        dataIndex: 'score',
        title: '使用积分',
        key: 'score'
      },
      {
        dataIndex: 'gmtCreate',
        title: '添加时间',
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
    this.findDeductionList()
  },
  methods: {
    findDeductionList () {
      this.spinning = true
      findDeductionList(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.records
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findDeductionList()
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber
      this.findDeductionList()
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
