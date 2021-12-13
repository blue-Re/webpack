
/* 
  问题？
    1. eslint 不认识 window、navigator 全局变量
      解决：需要修改 package.json中eslintConfig配置
      "env": {
        "browser":true // 支持浏览器端全局变量
      }
    2. serviceWorker 代码必须允许在服务器上
*/

// 注册 serviceWorker
// 处理兼容性问题
if ('serviceWorker' in navigator) {
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('/service-worker.js')
      .then(()=>{
        console.log('注册成功了');
      })
      .catch(()=>{
        console.log('注册失败了');
      })
  })
}