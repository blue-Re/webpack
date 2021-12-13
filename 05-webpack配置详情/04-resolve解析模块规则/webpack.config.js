const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',

  output: {
    // 打包后的文件名
    filename: 'built.js',
    // 打包后文件的输出路径
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // 多个 loader 使用数组的方式
        use: ['style-loader', 'css-loader']
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  mode: 'development',
  // 解析模块规则
  resolve: {
    // 配置路径别名
    alias: {
      '@': resolve(__dirname, 'src')
    },
    // 配置省略文件路径的后缀名
    extensions: ['.js', '.json', '.jsx'],
    // 告诉 webpack 解析模块 是去找哪个目录
    modules: [resolve(__dirname, '../../../node_modules'), 'node_modules']
  },
}