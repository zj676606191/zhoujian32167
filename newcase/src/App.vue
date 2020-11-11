<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body{font-family: '微软雅黑'!important; font-size: .1rem;}
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,button,textarea,p,blockquote,th,td { margin:0; padding:0; box-sizing:border-box;}
.line{display:block;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;}
.linedouble{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
    justify-content: space-between;
    }
.linecenter{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
    justify-content: space-around;
}
html{ height: 100%;}
li{ list-style: none;}
a{ cursor: pointer; text-decoration: none;}
a:hover{text-decoration: none;}
.w1200{width: 1200px; margin: 0 auto;}
button{cursor: pointer;}
h1,h2,h3,h4,h5,h6{
  text-align: center;
}
.nodata-box{
  margin: 10px 0px;
  overflow: hidden;
  text-align: center;
  width: 100%;
}
</style>
