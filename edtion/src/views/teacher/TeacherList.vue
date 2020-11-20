<template>
  <div style="padding:20px;background:white;">
    <a-button type="primary" @click="$refs.addTeacher.showModal()" style="margin-bottom:20px;">
      <a-icon type="plus" /> 添加教师
    </a-button>
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <img slot="image" slot-scope="text" style="width: 50px;height: 50px;border-radius:5px;" :src="text"/>
        <span slot="tags" slot-scope="text, record">
          <a-tag v-for="(item, index) in JSON.parse(record.tags)" :key="index" color="green">
            {{ item }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button type="dashed" @click="$refs.updateTeacher.showModal(record.id)" style="margin-right:10px;">
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
    <add-teacher ref="addTeacher" @refreshData="refreshData"></add-teacher>
    <update-teacher ref="updateTeacher" @refreshData="refreshData"></update-teacher>
  </div>
</template>

<script>
import { findTeacherList, deleteTeacher } from '@/api/manage'
import AddTeacher from '@/views/teacher/modal/AddTeacher'
import UpdateTeacher from '@/views/teacher/modal/UpdateTeacher'
export default {
  name: 'Workplace',
  components: {
    AddTeacher,
    UpdateTeacher
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
        dataIndex: 'image',
        key: 'image',
        scopedSlots: { customRender: 'image' }
      },
      {
        dataIndex: 'name',
        title: '教师名称',
        key: 'name'
      },
      {
        title: '粉丝量',
        key: 'fans',
        dataIndex: 'fans'
      },
      {
        title: '热度',
        key: 'heat',
        dataIndex: 'heat'
      },
      {
        title: '手机号码',
        key: 'phone',
        dataIndex: 'phone'
      },
      {
        title: '标签',
        key: 'tags',
        dataIndex: 'tags',
        scopedSlots: { customRender: 'tags' }
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
    this.findTeacherList()
  },
  methods: {
    findTeacherList () {
      this.spinning = true
      findTeacherList(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.records
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findTeacherList()
    },
    delConfirm (id) {
      var that = this
      this.$confirm({
        title: '确定删除该教师吗?',
        content: '友情提示',
        onOk () {
          deleteTeacher({ id: id }).then(res => {
            if (res.code === 0) {
              that.findTeacherList()
            }
          })
        },
        onCancel () {}
      })
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber
      this.findTeacherList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
