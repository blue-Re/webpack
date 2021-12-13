/* 
  使用dll 打包，会将某些第三方库 进行单独打包

  当运行 webpack 指令时 默认会去运行 webpack.config,js
  需要执行以下指令去运行 webpack.dll.js
    webpack --config webpack.dll.js
*/
const { resolve } = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    // 最终打包生成的[name]--> jquery
    // ['jquery]--> 要打包的库是 jquery
    jquery: ['jquery']
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dll'),
    library: '[name]_[hash]' // 打包的库里面向外暴露出去的内容的名字
  },
  plugins: [
    // 打包生成一个 manifest.json --> 提供和 jquery 映射
    new webpack.DllPlugin({
      name: '[name]_[hash]', // 映射库的暴露名称
      path: resolve(__dirname, 'dll/manifest.json')
    })
  ],
  mode: 'production'
}