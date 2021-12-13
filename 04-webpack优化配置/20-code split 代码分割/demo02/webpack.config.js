const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // 单入口
  // entry: './js/index.js',
  entry: {
    // 多入口，entry为一个对象
    index: './js/index.js',
    test: './js/test.js'
  },
  output: {
    // [name]: 取文件名
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build')
  },
  module:{},
  plugins:[
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ],
  // 增加如下配置项
  /* 
    1. 可以将node_modules中代码单独打包成一个chunk最终输出
    2. 自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独的一个chunk
  */
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  mode: 'production'
}