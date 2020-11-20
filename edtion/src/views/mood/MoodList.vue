<template>
  <div style="padding:20px;background:white;">
    <a-spin :spinning="spinning">
      <div style="margin-bottom:20px;">
        <a-input style="width:30%;margin-right:10px;" placeholder="根据标题搜索，请注意特殊符号" v-model="queryData.title"/>
        <a-button @click="searchClick" type="primary">
          根据标题搜索，请注意特殊符号
        </a-button>
      </div>
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <span slot="image" slot-scope="text">
          <img v-for="(item,index) in JSON.parse(text)" :key="index" :src="item" style="width: 64px;border-radius:3px;margin-right:5px;"/>
        </span>
        <span slot="userId" slot-scope="text, record">
          <a-select
            placeholder="请选择教师"
            :default-value="text===null?[]:text"
            @change="updateTeacher($event,record)"
            style="width:100px;margin-right:10px;"
          >
            <a-select-option
              v-for="(dataPro,index) in bindUserList"
              :key="index"
              :value="dataPro.id"
            > {{ dataPro.nickName }}</a-select-option>
          </a-select>
        </span>
        <span slot="isDelete" slot-scope="text">
          <a-tag color="#f50" v-if="text===1">
            隐藏
          </a-tag>
          <a-tag color="#87d068" v-if="text===0">
            显示
          </a-tag>
        </span>
        <span slot="gmtCreate" slot-scope="text">
          {{ formatDate(text,true) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button type="dashed" v-if="record.isDelete === 0" @click="updateIsDetele(record.id)">
            <a-icon type="del" /> 隐藏
          </a-button>
          <a-button type="dashed" v-if="record.isDelete === 1" @click="updateIsDetele(record.id)">
            <a-icon type="del" /> 显示
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
import { findUserMoodPage, updateIsDetele, updateMoodBindUser, findUserName } from '@/api/manage'
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
        title: '',
        pageSize: 10
      },
      total: 0,
      columns: [
        {
          dataIndex: 'title',
          title: '标题',
          key: 'title'
        },
        {
          title: '图片',
          key: 'image',
          dataIndex: 'image',
          scopedSlots: { customRender: 'image' }
        },
        {
          title: '上传用户',
          key: 'userId',
          dataIndex: 'userId',
          scopedSlots: { customRender: 'userId' }
        },
        {
          title: '状态',
          key: 'isDelete',
          dataIndex: 'isDelete',
          scopedSlots: { customRender: 'isDelete' }
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
      bindUserList: [],
      data: []
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {
    this.findUserMoodPage()
    this.findUserName()
  },
  methods: {
    updateTeacher (e, record) {
      var valData = {
        id: record.id,
        userId: e
      }
      updateMoodBindUser(valData).then(res => {
        if (res.code === 0) {
          this.$message.success(`成功`)
          this.findUserMoodPage()
        } else {
          this.$message.error(res.msg)
        }
      },
      error => {
        console.log('error', error)
      })
    },
    findUserName () {
      this.bindUserList = []
      findUserName().then(res => {
        if (res.code === 0) {
          this.bindUserList = res.data
        }
      },
      error => {
        console.log('error', error)
      })
    },
    searchClick () {
      console.log(this.queryData)
      this.queryData.pageNum = 0
      this.findUserMoodPage()
    },
    updateIsDetele (id) {
      var that = this
      this.$confirm({
        title: '确定要修改为此状态吗?',
        content: '友情提示',
        onOk () {
          updateIsDetele({ id: id }).then(res => {
            if (res.code === 0) {
              that.$message.success(`成功`)
              that.findUserMoodPage()
            } else {
              that.$message.error(res.msg)
            }
          })
        },
        onCancel () {}
      })
    },
    findUserMoodPage () {
      this.data = []
      this.spinning = true
      findUserMoodPage(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.records
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findUserMoodPage()
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber
      this.defaultCurrent = pageNumber
      this.findUserMoodPage()
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
