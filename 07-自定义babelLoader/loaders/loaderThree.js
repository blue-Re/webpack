const { getOptions } = require('loader-utils')
// 这个库专门用来验证 loader 是否符合规范
const { validate } = require('schema-utils')
const schema = require('./schema.json')

// loader的本质是一个函数
module.exports = function (content, map, meta) {
  /* 有时我们需要知道loader的配置项，需要去下载一个 npm i loader-utils -D */
  const options = getOptions(this);
  console.log('333333', options);

  // 校验 options 是否合法
  validate(schema, options, {
    name: 'loaderThree'
  })
  return content
}

// 每次解析loader都会去执行对应的pitch方法
module.exports.pitch = function () {
  console.log('pitch 333');
}