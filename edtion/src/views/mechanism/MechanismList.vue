<template>
  <div style="padding:20px;background:white;">
    <a-button type="primary" @click="$refs.addMechanism.showModal()" style="margin-bottom:20px;margin-right:10px;">
      <a-icon type="plus" /> 添加机构
    </a-button>
    <a-radio-group defaultValue="0" @change="handleSizeMechanismGrade">
      <a-radio-button value="0">全部</a-radio-button>
      <a-radio-button
        :value="1">
        普通机构
      </a-radio-button>
      <a-radio-button
        :value="2">
        连锁机构
      </a-radio-button>
      <a-radio-button
        :value="3">
        工作室
      </a-radio-button>
      <a-radio-button
        :value="4">
        特殊机构
      </a-radio-button>
    </a-radio-group>
    <a-radio-group style="float: right;" defaultValue="0" @change="handleSizeMechanismType">
      <a-radio-button value="0">全部</a-radio-button>
      <a-radio-button
        v-for="(dataPro,index) in this.mechanismTypeList"
        :key="index"
        :value="dataPro.id">
        {{ dataPro.typeName }}
      </a-radio-button>
    </a-radio-group>
    <a-spin :spinning="spinning">
      <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="id" bordered>
        <img slot="image" slot-scope="text" style="width: 50px;height: 50px;border-radius:5px;" :src="text"/>
        <span slot="itude" slot-scope="text, record">
          经度：{{ record.latitude }}&ensp;纬度：{{ record.longitude }}
        </span>
        <span slot="personnelId" slot-scope="text, record">
          <a-select
            placeholder="请选择工作人员"
            :default-value="text===null?[]:text"
            @change="updatePersonnel($event,record)"
            style="width:100px;margin-right:10px;"
          >
            <a-select-option
              value=""
            > 取消绑定</a-select-option>
            <a-select-option
              v-for="(dataPro,index) in personnelList"
              :key="index"
              :value="dataPro.id"
            > {{ dataPro.nickName }}</a-select-option>
          </a-select>
        </span>
        <span slot="status" slot-scope="text, record">
          <a-switch checked-children="通过" :checked="record.status===1" @change="updateStatus(record)" un-checked-children="未审核" default-checked />
        </span>
        <span slot="flag" slot-scope="text, record">
          <a-switch checked-children="封禁" :checked="record.flag===1" @change="updateFlag(record)" un-checked-children="正常" default-checked />
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button type="dashed" @click="$refs.updateMechanism.showModal(record.id)" style="margin-right:10px;">
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
          v-model="defaultCurrent"
          :total="total"
          :pageSize="queryData.pageSize"
          @change="onChangePage"
        />
      </template>
    </a-spin>
    <add-mechanism ref="addMechanism" @refreshData="refreshData"></add-mechanism>
    <update-mechanism ref="updateMechanism" @refreshData="refreshData"></update-mechanism>
  </div>
</template>

<script>
import { findMechanismList, deleteMechanism, updateMechanismStatus, updateMechanismFlag, findAllMechanismType, updateMechanismPersonnel, findPersonnelUser } from '@/api/manage'
import AddMechanism from '@/views/mechanism/modal/AddMechanism'
import UpdateMechanism from '@/views/mechanism/modal/UpdateMechanism'
export default {
  name: 'Workplace',
  components: {
    AddMechanism,
    UpdateMechanism
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
        dataIndex: 'name',
        title: '机构名称',
        key: 'name'
      },
      {
        title: '关注量',
        key: 'attention',
        dataIndex: 'attention'
      },
      {
        title: '手机',
        key: 'phone',
        dataIndex: 'phone'
      },
      {
        title: '座机',
        key: 'mobile',
        dataIndex: 'mobile'
      },
      {
        title: '工作人员',
        key: 'personnelId',
        dataIndex: 'personnelId',
        scopedSlots: { customRender: 'personnelId' }
      },
      {
        title: '审核状态',
        key: 'status',
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '封禁状态',
        key: 'flag',
        dataIndex: 'flag',
        scopedSlots: { customRender: 'flag' }
      },
      {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' }
      }],
      data: [],
      defaultCurrent: 1,
      personnelList: [],
      mechanismTypeList: []
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {
    this.findAllMechanismType()
    this.findMechanismList()
    this.findPersonnelUser()
  },
  methods: {
    findPersonnelUser () {
      this.personnelList = []
      findPersonnelUser().then(res => {
        if (res.code === 0) {
          this.personnelList = res.data
        }
      },
      error => {
        console.log('error', error)
      })
    },
    updatePersonnel (e, record) {
      var personnelId = e
      if (e === '') {
        personnelId = null
      }
      var valData = {
        mechanismId: record.id,
        personnelId: personnelId
      }
      updateMechanismPersonnel(valData).then(res => {
        if (res.code === 0) {
          this.$message.success(`成功`)
        }
      },
      error => {
        console.log('error', error)
      })
    },
    handleSizeMechanismType (e) {
      this.defaultCurrent = 1
      this.queryData.pageNum = 0
      if (e.target.value === '0') {
        this.queryData.typeId = null
      } else {
        this.queryData.typeId = e.target.value
      }
      this.findMechanismList()
    },
    handleSizeMechanismGrade (e) {
      this.defaultCurrent = 1
      this.queryData.pageNum = 0
      if (e.target.value === '0') {
        this.queryData.grade = null
      } else {
        this.queryData.grade = e.target.value
      }
      this.findMechanismList()
    },
    updateStatus (record) {
      updateMechanismStatus({ id: record.id, status: record.status === 0 ? 1 : 0 }).then(res => {
        if (res.code === 0) {
          record.status = record.status === 0 ? 1 : 0
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
      console.log(record)
    },
    updateFlag (record) {
      updateMechanismFlag({ id: record.id, flag: record.flag === 0 ? 1 : 0 }).then(res => {
        if (res.code === 0) {
          record.flag = record.flag === 0 ? 1 : 0
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    findAllMechanismType () {
      this.mechanismTypeList = []
      findAllMechanismType().then(res => {
        if (res.code === 0) {
          this.mechanismTypeList = res.data
        }
      },
      error => {
        console.log('error', error)
      })
    },
    findMechanismList () {
      this.spinning = true
      findMechanismList(this.queryData).then(res => {
        this.spinning = false
        if (res.code === 0) {
          this.data = res.data.list
          this.total = res.data.total
        }
      })
    },
    refreshData () {
      this.findMechanismList()
    },
    delConfirm (id) {
      var that = this
      this.$confirm({
        title: '确定删除该机构吗?',
        content: '友情提示',
        onOk () {
          deleteMechanism({ id: id }).then(res => {
            if (res.code === 0) {
              that.findMechanismList()
            }
          })
        },
        onCancel () {}
      })
    },
    onChangePage (pageNumber) {
      this.queryData.pageNum = pageNumber - 1
      this.defaultCurrent = pageNumber
      this.findMechanismList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
