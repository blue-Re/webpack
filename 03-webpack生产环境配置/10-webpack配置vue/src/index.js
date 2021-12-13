import Vue from 'vue';
import './css/index.css'
// import App from './vue/app.js'
import App from './vue/App.vue'


// 使用vue进行开发
new Vue({
  el: '#app',
  template: `<App/>`,
  components:{
    App
  }
})
