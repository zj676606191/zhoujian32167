<template>
<div>
  <div style="font-size:.2rem">
   测试字体大小自动适应，这是UI界面 
  </div>
    <div>
      各种按钮组件
      <van-button type="primary">主要按钮</van-button>
      <van-button type="info">信息按钮</van-button>
      <van-button type="default">默认按钮</van-button>
      <van-button type="warning">警告按钮</van-button>
      <van-button type="danger">危险按钮</van-button>
  </div>
  <div>
    <van-cell is-link @click="showPopup">展示弹出层</van-cell>
        <van-popup 
          v-model="show"
          closeable
          round 
          close-icon-position="top-right"
          overlay-class="dps"
          :style="{ height: '30%' }">
          <van-button loading type="primary" color="rgba(0, 0, 0,.5)"/>
          </van-popup>
  </div>
  <div>
    <van-icon name="like" size="40" /> <van-icon name="chat-o" size=".3rem"  :color="'red'"/>
  </div>
  <div>
    <van-button loading type="info" loading-text="加载中..." />
    <van-button loading type="primary" color="rgba(0, 0, 0,0)"/>
    <van-button loading type="primary" loading-type="spinner" />
    <van-button loading type="info" loading-text="加载中..." />
  </div>
  <div>
      <div @click="fade()">测试</div>
          <!-- 淡入 -->
      <transition name="van-fade">
        <div v-show="visible">Fade</div>
      </transition>

      <!-- 上滑进入 -->
      <transition name="van-slide-up">  
        <div v-show="visible">Slide Up</div>
      </transition>

      <!-- 下滑进入 -->
      <transition name="van-slide-down">
        <div v-show="visible">Slide Down</div>
      </transition>

      <!-- 左滑进入 -->
      <transition name="van-slide-left">
        <div v-show="visible">Slide Left</div>
      </transition>

      <!-- 右滑进入 -->
      <transition name="van-slide-right">
        <div v-show="visible">Slide Right</div>
      </transition>
  </div>
  <div>
    <van-uploader v-model="fileList" multiple :after-read="afterRead" @delete="beforedelete"/>
  </div>
  <div>
    微信登陆
  </div>
  <div>
        <van-cell title="选择单个日期" :value="date" @click="show = true" />
        <van-calendar v-model="show" @confirm="onConfirm" />
  </div>
  <!-- 遍历测试 -->
  <div v-for="(item,index) in list">{{item.typeName}}<img :src="item.icon"></div>
</div>
</template>

<script>  
import { findUserMoodPage, findByMiniMechanismTypeSize } from '@/api/api'
export default {
  name: "UiVant111111",
  data() {
    return {
      show:false,
      visible:false,
      fileList: [],
      date: '',
      show: false,
      list:[],
    };
  },
  created () {
    this.postApiRun()
    this.getApiRun()
    // this.getCode()
    console.log(111)
  },
 methods: {
    showPopup() {
      this.show = true;
    },
    fade(){
      this.visible=!this.visible  
      this.$toast.loading({ message: '加载中...',forbidClick: true,duration: 8000,overlay:true})
    },
//读取到file这张图片后
    afterRead(file) {
      //一次上传单张，file是一个对象
      if (!Array.isArray(file)) {
        this.repeatImgs = 0
        console.log(this.fileList)
      } 
      //一次上传多张，file是一个数组
      else {
        for (let i = 0; i < file.length; i++) {
          this.imgHandleFun(file[i].content, i, file.length);
        }
        this.repeatImgs = 0
      }  
    },
    beforedelete(){
      console.log(1111)
    },
    postApiRun(){
     findUserMoodPage({pageSize:5,pageNum:0}).then(res => {
        if (res.data.status === 0) {
            console.log(res)
        }
      })
    },
    getApiRun(){
         findByMiniMechanismTypeSize({pageSize:5}).then(res => {
        if (res.data.code === 0) {
             this.list = res.data.data
            //  动态样式确认
             this.visible= true
        }
      })
    },
    getCode () { // 非静默授权，第一次有弹框
      const code = this.getUrlParam('code') // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
      const local = 'https://boss.value-education.com'
      console.log(code)
      if (code == null || code === '') {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4030150d1ce0336c&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
      } else {
        //this.getOpenId(code) //把code传给后台获取用户信息
        this.code=code;
      }
    },
    getUrlParam: function (name) {
      var reg=new RegExp('(^|&)'+name+'=([^&]*)(&|$)')
      var r=window.location.search.substr(1).match(reg)
      if(r!=null) return unescape(r[2])
      return null
    },
    formatDate(date) {
          return `${date.getMonth() + 1}/${date.getDate()}`;
      },
      onConfirm(date) {
          this.show = false;
          this.date = this.formatDate(date);
          return false
      },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
