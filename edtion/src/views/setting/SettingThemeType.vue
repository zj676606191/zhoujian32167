<template>
  <div style="padding:20px;background:white;">
    <a-button type="primary" @click="$refs.addThemeType.showModal()" style="margin-bottom:20px;">
      <a-icon type="plus" /> 添加主题类型
    </a-button>
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <span slot="action" slot-scope="text, record">
          <a-button type="dashed" @click="$refs.updateThemeType.showModal(record.id)" style="margin-right:10px;">
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
    <add-theme-type ref="addThemeType" @refreshData="refreshData"></add-theme-type>
    <update-theme-type ref="updateThemeType" @refreshData="refreshData"></update-theme-type>
  </div>
</template>

<script>
import { findThemeTypeList, deleteThemeType } from '@/api/manage'
import AddThemeType from '@/views/setting/modal/AddThemeType'
import UpdateThemeType from '@/views/setting/modal/UpdateThemeType'
export default {
  name: 'Workplace',
  components: {
    AddThemeType,
    UpdateThemeType
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
        dataIndex: 'typeName',
        title: '类型名称',
        key: 'name'
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
    this.findThemeTypeList()
  },
  methods: {
    findThemeTypeList () {
      this.spinning = true
      findThemeTypeList(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.records
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findThemeTypeList()
    },
    delConfirm (id) {
      var that = this
      this.$confirm({
        title: '确定删除该主题类型吗?',
        content: '友情提示',
        onOk () {
          deleteThemeType({ id: id }).then(res => {
            if (res.code === 0) {
              that.findThemeTypeList()
            }
          })
        },
        onCancel () {}
      })
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber - 1
      this.findThemeTypeList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
