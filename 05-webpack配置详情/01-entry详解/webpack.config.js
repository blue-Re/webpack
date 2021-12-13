const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // 入口为字符串
  // entry: './src/index.js',
  // 入口为数组
  // entry: ['./src/index.js', './src/test.js'],
  // 入口为object
  entry: {
    index: './src/index.js',
    two: ['./src/decrement.js', './src/test.js']
  },

  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'build')
  },
  module: {},
  plugins: [
    new HtmlWebpackPlugin()
  ],
  mode: 'development'
}