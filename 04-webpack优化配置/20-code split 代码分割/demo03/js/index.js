function add(x, y) {
  return x + y;
}
console.log(add(4, 5));

/* 
  通过js代码，让某个文件被单独打包成一个chunk
  import 动态导入语法：能将某个文件单独打包
*/

/* webpackChunkName:'test' */ // 可以重命名打包后的文件名
import(/* webpackChunkName:'test' */'./test')
  .then((result) => {
    // 文件加载成功
    console.log(result);
  })
  .catch(() => {
    console.log('文件加载失败');
  })