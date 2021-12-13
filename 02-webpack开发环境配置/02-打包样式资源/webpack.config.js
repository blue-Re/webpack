/*
  webpack.config.js  webpack的配置文件
    作用：指示webpack干哪些活（当运行webpack指令时，会加载里面的配置）

    所有的构建工具都是基于node js 平台运行的~ 模块化采用common js
*/

// resolve用来拼接绝对路径的方法
const { resolve } = require('path')

module.exports = {
  // webpack配置
  // 入口起点
  entry:'./src/index.js',

  // 输出
  output:{
    filename:'built.js',// 输出文件名
    path:resolve(__dirname,'build')// 输出路径,__dirname代表当前文件的目录绝对路径
  },

  // loader的配置
  module:{
    rules:[
      // 详细loader配置
      {
        // 通过test匹配哪些文件（检测文件类型）
        test:/\.css$/,

        // 通过use来使用哪些loader对文件进行处理
        use:[
          // use数组中loader的执行顺序：从右往左，从下到上一,依次执行
          'style-loader', //创建style标签，将js中的样式资源插入进行，添加到head中生效
          'css-loader' //将css文件变成commonJs模块加载到js中，里面内容是样式字符串
        ]
      },
      // 不同文件必须配置不同loader处理
      {
        test:/\.less$/,
        use:[
          'style-loader',//创建style标签，将js中的样式资源插入进行，添加到head中生效
          'css-loader', //将css文件变成commonJs模块加载到js中，里面内容是样式字符串
          // 需要下载less和less-loader
          'less-loader' //将less文件编译成css文件
        ]
      }
    ]
  },

  // plugins的配置
  plugins:[
    // 详细plugins的配置

  ],

  // 模式
  mode:'development',
  // mode:'production'
}