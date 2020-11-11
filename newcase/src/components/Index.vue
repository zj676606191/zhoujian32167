<template>
<div>
  <div style="font-size:.2rem">
   测试字体大小自动适应 
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
  <div @click="toUiVant">
      测试跳转携带参数
  </div>
</div>
</template>

<script>  
export default {
  name: "HelloWorld",
  data() {
    return {
     show:false,
     visible:false,
      fileList: [],
    };
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
    toUiVant(){
      //  window.open('/#/UiVant/' + 333)
         this.$router.push({name:'UiVant',params: {id:1}})
    } 
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
