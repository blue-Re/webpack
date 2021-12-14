// loader的本质是一个函数
// 同步loader
// module.exports = function (content, map, meta) {
//   console.log('22222222');

//   return content
// }

// 异步loader(推荐使用)
module.exports = function (content, map, meta) {
  console.log(222);

  const callback = this.async()

  setTimeout(() => {
    callback(null, content)
  }, 1000)
}

// 每次解析loader都会去执行对应的pitch方法
module.exports.pitch = function () {
  console.log('pitch 222');
}