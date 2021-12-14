// loader的本质是一个函数

// 同步 loader
// 第一种同步执行的写法
// module.exports = function (content, map, meta) {
//   console.log('11111111');
  
//   return content
// }

// 第二种同步执行的写法
module.exports = function (content, map, meta) {
  console.log(111);

  this.callback(null, content, map, meta)
}

// 每次解析loader都会去执行对应的pitch方法
module.exports.pitch = function () {
  console.log('pitch 111111');
}