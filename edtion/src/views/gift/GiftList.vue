<template>
  <div style="padding:20px;background:white;">
    <a-button type="primary" @click="$refs.addGift.showModal()" style="margin-bottom:20px;">
      <a-icon type="plus" /> 添加礼品
    </a-button>
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <img slot="image" slot-scope="text" style="width: 50px;height: 50px;border-radius:5px;" :src="text"/>
        <span slot="status" slot-scope="text">
          <a-tag color="green" v-if="text === 0">
            显示
          </a-tag>
          <a-tag color="red" v-if="text === 1">
            隐藏
          </a-tag>
        </span>
        <span slot="gmtCreate" slot-scope="text">
          {{ formatDate(text,true) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button type="dashed" @click="$refs.updateGift.showModal(record.id)" style="margin-right:10px;">
            <a-icon type="edit" /> 编辑
          </a-button>
          <a-button type="danger" @click="delConfirm(record.id)">
            <a-icon type="delete" /> 删除
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
    <add-gift ref="addGift" @refreshData="refreshData"></add-gift>
    <update-gift ref="updateGift" @refreshData="refreshData"></update-gift>
  </div>
</template>

<script>
import { findGiftList, deleteGift } from '@/api/manage'
import AddGift from '@/views/gift/modal/AddGift'
import UpdateGift from '@/views/gift/modal/UpdateGift'
export default {
  name: 'Workplace',
  components: {
    AddGift,
    UpdateGift
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
        title: '图片',
        dataIndex: 'image',
        key: 'image',
        scopedSlots: { customRender: 'image' }
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
        dataIndex: 'day',
        title: '兑换间隔天数',
        key: 'day'
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
    this.findGiftList()
  },
  methods: {
    findGiftList () {
      this.spinning = true
      findGiftList(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.records
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findGiftList()
    },
    delConfirm (id) {
      var that = this
      this.$confirm({
        title: '确定删除该礼品吗?',
        content: '友情提示',
        onOk () {
          deleteGift({ id: id }).then(res => {
            if (res.code === 0) {
              that.findGiftList()
            }
          })
        },
        onCancel () {}
      })
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber
      this.findGiftList()
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
