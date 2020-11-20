<template>
  <div style="padding:20px;background:white;">
    <a-button type="primary" @click="$refs.addTheme.showModal()" style="margin-bottom:20px;">
      <a-icon type="plus" /> 添加主题
    </a-button>
    <a-radio-group style="float: right;" defaultValue="0" @change="handleSizeThemeType">
      <a-radio-button value="0">全部</a-radio-button>
      <a-radio-button
        v-for="(dataPro,index) in this.themeTypeList"
        :key="index"
        :value="dataPro.id">
        {{ dataPro.typeName }}
      </a-radio-button>
    </a-radio-group>
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <img slot="image" slot-scope="text" style="width: 50px;height: 50px;border-radius:5px;" :src="text"/>
        <span slot="action" slot-scope="text, record">
          <a-button type="dashed" @click="$refs.updateTheme.showModal(record.id)" style="margin-right:10px;">
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
    <add-theme ref="addTheme" @refreshData="refreshData"></add-theme>
    <update-theme ref="updateTheme" @refreshData="refreshData"></update-theme>
  </div>
</template>

<script>
import { findThemeList, deleteTheme, findAllThemeType } from '@/api/manage'
import AddTheme from '@/views/theme/modal/AddTheme'
import UpdateTheme from '@/views/theme/modal/UpdateTheme'
export default {
  name: 'Workplace',
  components: {
    AddTheme,
    UpdateTheme
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
        title: '封面',
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
        title: '点赞数',
        key: 'likes',
        dataIndex: 'likes'
      },
      {
        title: '关联机构',
        key: 'mechanismName',
        dataIndex: 'mechanismName'
      },
      {
        title: '关联老师',
        key: 'teacherName',
        dataIndex: 'teacherName'
      },
      {
        title: '关联学生',
        key: 'studentName',
        dataIndex: 'studentName'
      },
      {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' }
      }],
      data: [],
      themeTypeList: []
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {
    this.findAllThemeType()
    this.findThemeList()
  },
  methods: {
    handleSizeThemeType (e) {
      if (e.target.value === '0') {
        this.queryData.typeId = null
      } else {
        this.queryData.typeId = e.target.value
      }
      this.findThemeList()
    },
    findAllThemeType () {
      this.themeTypeList = []
      findAllThemeType().then(res => {
        if (res.code === 0) {
          this.themeTypeList = res.data
        }
      },
      error => {
        console.log('error', error)
      })
    },
    findThemeList () {
      this.spinning = true
      findThemeList(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.list
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findThemeList()
    },
    delConfirm (id) {
      var that = this
      this.$confirm({
        title: '确定删除该主题吗?',
        content: '友情提示',
        onOk () {
          deleteTheme({ id: id }).then(res => {
            if (res.code === 0) {
              that.findThemeList()
            }
          })
        },
        onCancel () {}
      })
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber - 1
      this.findThemeList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
