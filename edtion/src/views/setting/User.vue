<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col
            :md="8"
            :sm="24"
          >
            <a-form-item label="用户名称">
              <a-input
                v-model="queryParam.userName"
                placeholder=""
              />
            </a-form-item>
          </a-col>
          <a-col
            :md="8"
            :sm="24"
          >
            <a-form-item label="状态">
              <a-select
                v-model="queryParam.isDeleted"
                placeholder="请选择"
                default-value="0"
              >
                <a-select-option value="1">禁用</a-select-option>
                <a-select-option value="0">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <span class="table-page-search-submitButtons">
            <a-button
              type="primary"
              @click="$refs.table.refresh(true)"
            >查询</a-button>
            <a-button
              style="margin-left: 8px"
              @click="() => queryParam = {}"
            >重置</a-button>
          </span>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button
        v-action:add
        type="primary"
        icon="plus"
        @click="$refs.userModal.add()"
      >新建</a-button>
      <a-button
        type="dashed"
        @click="tableOption"
      >{{ optionAlertShow && '关闭' || '开启' }} 提示框</a-button>
      <a-dropdown
        v-action:edit
        v-if="selectedRowKeys.length > 0"
      >
        <a-menu
          slot="overlay"
          @click="handleStatusClick"
        >
          <a-menu-item key="1">
            <a-icon type="close" />禁用</a-menu-item>
          <a-menu-item key="2">
            <a-icon type="check" />启用</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="userId"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <span
        slot="isDeleted"
        slot-scope="text"
      >
        <a-badge
          v-if="!text"
          status="processing"
          text="启用"
        />
        <a-badge
          v-if="text"
          status="error"
          text="禁用"
        />
      </span>
      <span
        slot="action"
        slot-scope="text, record"
      >
        <template v-if="record.userName !=='admin'">
          <a-button
            v-action:edit
            @click="handleEdit(record)"
            type="primary"
          >编辑</a-button>
          <a-divider type="vertical" v-action:delete />
          <a-popconfirm
            v-action:delete
            title="你确认删除该用户， 删除之后无法恢复?"
            @confirm="confirmDelete(record)"
            okText="确认"
            cancelText="取消"
          >
            <a-button type="danger">删除</a-button>
          </a-popconfirm>
          <a-divider
            type="vertical"
            v-action:edit
          />
          <a-dropdown v-action:edit>
            <a-button>切换状态</a-button>
            <a-menu slot="overlay">
              <a-menu-item v-if="$auth('setting_user.edit')">
                <a
                  href="javascript:;"
                  @click="handleStatus(record.userId, false)"
                >禁用</a>
              </a-menu-item>
              <a-menu-item v-if="$auth('setting_user.edit')">
                <a
                  href="javascript:;"
                  @click="handleStatus(record.userId, true)"
                >启用</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
        <template v-else>
          <a-tag color="red">管理员无法操作</a-tag>
        </template>
      </span>
    </s-table>
    <user-form
      ref="userModal"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import UserForm from './modal/UserForm'
import user from '@/api/managerService'

export default {
  name: 'TableList',
  components: {
    STable,
    UserForm
  },
  data () {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      userData: [],
      // 表头
      columns: [
        {
          title: '用户名称',
          dataIndex: 'userName'
        },
        {
          title: '所属角色',
          dataIndex: 'role',
          sorter: true,
          customRender: (role) => role == null ? '角色不存在' : role.roleName
        },
        {
          title: '状态',
          dataIndex: 'isDeleted',
          scopedSlots: { customRender: 'isDeleted' },
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '300px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        // this.userList({}, 1, 30)
        return user.userService.userList(this.queryParam, parameter.pageNo, parameter.pageSize)
          .then(res => {
            if (res.status === 0) {
              return res
            } else {
              this.$message.error(res.msg, 2)
              return {
                pagingData: {
                  pageNum: 0,
                  total: 0
                },
                listData: []
              }
            }
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
          getCheckboxProps: record => ({
            props: {
              disabled: record.userName === 'admin', // Column configuration not to be checked
              name: record.no
            }
          })
        }
      },
      optionAlertShow: false
    }
  },
  filters: {
  },
  created () {
    this.tableOption()
  },
  methods: {
    tableOption () {
      if (!this.optionAlertShow) {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              props: {
                disabled: record.userName === 'admin', // Column configuration not to be checked
                name: record.userName
              }
            })
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },
    handleEdit (record) {
      console.log(record)
      this.$refs.userModal.edit(record)
    },
    handleStatus (userId, state) {
      let userIds = []
      if (userId) {
        userIds.push(userId)
      } else {
        userIds = this.selectedRowKeys
      }
      user.userService.changeState(userIds, state)
        .then(res => {
          if (res.status > 0) {
            this.$message.error(res.msg, 2)
          } else {
            this.$refs.table.refresh()
            this.$message.success('切换成功', 1)
          }
        })
    },
    handleStatusClick (e) {
      if (e.key === '1') {
        this.handleStatus(null, false)
      } else {
        this.handleStatus(null, true)
      }
    },
    confirmDelete (record) {
      user.userService.delete(record.userId)
        .then(res => {
          if (res.status > 0) {
            this.$message.error(res.msg, 2)
          } else {
            this.$refs.table.refresh()
            this.$message.success('删除成功', 1)
          }
        })
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>
