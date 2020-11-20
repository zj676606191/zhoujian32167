<!--
 * @Author: ChenXingLiang
 * @Date: 2019-08-01 21:52:35
 * @LastEditors: ChenXingLiang
 * @LastEditTime: 2019-08-19 15:51:24
 * @Description: Logo控件
 -->
<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <img style="width:50px;height:50px;" alt="logo" src="@/assets/logo.png" />
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
// import LogoSvg from '@/assets/logo.svg?inline'
import LogoPng from '@/assets/logo.png'

export default {
  name: 'Logo',
  components: {
    // LogoSvg,
    LogoPng
  },
  props: {
    title: {
      type: String,
      default: 'BOSS管理系统',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
