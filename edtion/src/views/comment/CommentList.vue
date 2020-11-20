<template>
  <div style="padding:20px;background:white;">
    <a-radio-group defaultValue="MOOD" style="margin-bottom:20px;" @change="handleType">
      <a-radio-button value="MOOD">
        心情
      </a-radio-button>
      <a-radio-button value="VIDEO">
        视频
      </a-radio-button>
    </a-radio-group>
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <span slot="avatarUrl" slot-scope="text">
          <img :src="text" style="width: 64px;border-radius:10px;"/>
        </span>
        <span slot="gmtCreate" slot-scope="text">
          {{ formatDate(text,true) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button type="dashed" @click="del(record.id)">
            <a-icon type="del" /> 删除
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
import { findCommentPage, delComment } from '@/api/manage'
export default {
  name: 'Workplace',
  components: {
  },
  data () {
    return {
      spinning: false,
      queryData: {
        pageNum: 0,
        type: 'MOOD',
        pageSize: 10
      },
      total: 0,
      columns: [
        {
          title: '头像',
          key: 'avatarUrl',
          dataIndex: 'avatarUrl',
          scopedSlots: { customRender: 'avatarUrl' }
        },
        {
          dataIndex: 'name',
          title: '用户',
          key: 'name'
        },
        {
          title: '内容',
          key: 'content',
          dataIndex: 'content'
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
    this.findCommentPage()
  },
  methods: {
    handleType (e) {
      this.queryData.type = e.target.value
      this.findCommentPage()
    },
    del (id) {
      var that = this
      this.$confirm({
        title: '确定要删除吗?',
        content: '友情提示',
        onOk () {
          delComment({ id: id }).then(res => {
            if (res.code === 0) {
              that.$message.success(`成功`)
              that.findCommentPage()
            } else {
              that.$message.error(res.msg)
            }
          })
        },
        onCancel () {}
      })
    },
    findCommentPage () {
      this.spinning = true
      findCommentPage(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.list
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findCommentPage()
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber - 1
      this.findCommentPage()
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
