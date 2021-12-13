/* 
  loader: 1.下载 2.使用（配置loader）
  plugins：1.下载 2.引入 3.使用
*/

const { resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    // plugins的配置
    // html-webpack-plugin
    // 功能：默认会创建一个空的html，自动引入打包输出的所有资源(js、css)
    // 需求：需要有结构的html文件
    new HtmlWebpackPlugin({
      // 复制 './src/index.html' 文件,并自动引入打包输出的所有资源（js、css）
      template: './src/index.html'
    }),
    // 告诉webpack哪些库不参与打包，同时使用时的名称也得变
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json')
    }),
    // 将某个文件打包输出，并在html文件当中自动引入
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, 'dll/jquery.js')
    })
  ],
  mode: 'development'
}