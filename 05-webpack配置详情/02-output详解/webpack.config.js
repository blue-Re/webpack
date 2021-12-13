const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',

  output: {
    // 打包后的文件名
    filename: 'built.js',
    // 打包后文件的输出路径
    path: resolve(__dirname, 'build'),
    // 所有资源引入公共路径前缀
    publicPath: '/',
    // 非入口的chunk的名
    chunkFilename: '[name]_chunk.js',
    // 整个库向外暴露的变量名
    // library: '[name]',
    // 变量添加在哪
    // libraryTarget: 'window' // 变量名添加在 browser上
    // libraryTarget: 'global' // 变量名添加在 node 上
  },
  module: {},
  plugins: [
    new HtmlWebpackPlugin()
  ],
  mode: 'development'
}