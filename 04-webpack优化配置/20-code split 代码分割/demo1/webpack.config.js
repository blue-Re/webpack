const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // 单入口
  // entry: './js/index.js',
  entry: {
    // 多入口，entry为一个对象
    // 有几个入口，最终输出就有几个 bundle
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
  mode: 'production'
}