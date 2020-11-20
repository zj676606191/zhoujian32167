<template>
  <div style="padding:20px;background:white;">
    <a-button type="primary" @click="$refs.addStudent.showModal()" style="margin-bottom:20px;">
      <a-icon type="plus" /> 添加学生
    </a-button>
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <img slot="image" slot-scope="text" style="width: 50px;height: 50px;border-radius:5px;" :src="text"/>
        <span slot="sex" slot-scope="text, record">
          <a-tag color="green">
            {{ record.sex === 0 ? '女': '男' }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button type="dashed" @click="$refs.updateStudent.showModal(record.id)" style="margin-right:10px;">
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
    <add-student ref="addStudent" @refreshData="refreshData"></add-student>
    <update-student ref="updateStudent" @refreshData="refreshData"></update-student>
  </div>
</template>

<script>
import { findStudentList, deleteStudent } from '@/api/manage'
import AddStudent from '@/views/student/modal/AddStudent'
import UpdateStudent from '@/views/student/modal/UpdateStudent'
export default {
  name: 'Workplace',
  components: {
    AddStudent,
    UpdateStudent
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
        title: '学生名称',
        key: 'name'
      },
      {
        dataIndex: 'phone',
        title: '监护人手机号码',
        key: 'phone'
      },
      {
        title: '性别',
        key: 'sex',
        dataIndex: 'sex',
        scopedSlots: { customRender: 'sex' }
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
    this.findStudentList()
  },
  methods: {
    findStudentList () {
      this.spinning = true
      findStudentList(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.records
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findStudentList()
    },
    delConfirm (id) {
      var that = this
      this.$confirm({
        title: '确定删除该学生吗?',
        content: '友情提示',
        onOk () {
          deleteStudent({ id: id }).then(res => {
            if (res.code === 0) {
              that.findStudentList()
            }
          })
        },
        onCancel () {}
      })
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber
      this.findStudentList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
