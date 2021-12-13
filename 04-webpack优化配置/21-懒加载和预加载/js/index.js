console.log('index被加载了');

/* 
  懒加载： 当前文件需要使用时才加载

  预加载 prefetch 会在使用之前，提前加载js文件

  正常加载可以是并行加载（同一时间加载多个文件）
  预加载：等其他资源加载完毕，浏览器空闲了才回去加载资源
*/
document.getElementById('btn').onclick = ()=>{
  // 懒加载
  // import(/* webpackChunkName: 'test'*/'./test').then(({increment})=>{
  //   console.log(increment(1, 2));
  // })
  // 这块是预加载
  import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test').then(({increment})=>{
    console.log(increment(1, 2));
  })
}