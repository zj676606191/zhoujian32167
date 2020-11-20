<!--账户设置-->
<template>
  <div style="background:white;overflow: hidden;padding: 20px;">
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
      <a-tabs type="card" tabPosition="left" defaultActiveKey="1">
        <a-tab-pane key="1" tab="账号安全设置">
          <account-safe></account-safe>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
import AccountSafe from '@/views/accountSetting/AccountSafe'
export default {
  components: {
    AccountSafe
  },
  data () {
    return {
      openKeys: [],
      selectedKeys: []
    }
  },
  methods: {
  }
}
</script>
