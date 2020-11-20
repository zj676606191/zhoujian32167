<template>
  <div style="padding:20px;background:white;">
    <a-button type="primary" @click="$refs.addMechanismType.showModal()" style="margin-bottom:20px;">
      <a-icon type="plus" /> 添加类型
    </a-button>
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <img slot="icon" slot-scope="text" style="width: 50px;height: 50px;border-radius:5px;" :src="text"/>
        <span slot="action" slot-scope="text, record">
          <a-button type="dashed" @click="$refs.updateMechanismType.showModal(record.id)" style="margin-right:10px;">
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
    <add-mechanism-type ref="addMechanismType" @refreshData="refreshData"></add-mechanism-type>
    <update-mechanism-type ref="updateMechanismType" @refreshData="refreshData"></update-mechanism-type>
  </div>
</template>

<script>
import { findMechanismTypeList, deleteMechanismType } from '@/api/manage'
import AddMechanismType from '@/views/setting/modal/AddMechanismType'
import UpdateMechanismType from '@/views/setting/modal/UpdateMechanismType'
export default {
  name: 'Workplace',
  components: {
    AddMechanismType,
    UpdateMechanismType
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
        dataIndex: 'icon',
        title: '图标',
        key: 'icon',
        scopedSlots: { customRender: 'icon' }
      },
      {
        dataIndex: 'typeName',
        title: '类型名称',
        key: 'name'
      },
      {
        dataIndex: 'sortNum',
        title: '排序',
        key: 'sortNum'
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
    this.findMechanismTypeList()
  },
  methods: {
    findMechanismTypeList () {
      this.spinning = true
      findMechanismTypeList(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.records
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findMechanismTypeList()
    },
    delConfirm (id) {
      var that = this
      this.$confirm({
        title: '确定删除该机构类型吗?',
        content: '友情提示',
        onOk () {
          deleteMechanismType({ id: id }).then(res => {
            if (res.code === 0) {
              that.findMechanismTypeList()
            }
          })
        },
        onCancel () {}
      })
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber - 1
      this.findMechanismTypeList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
