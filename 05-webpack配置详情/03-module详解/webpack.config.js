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
      {
        test: /\.js/,
        // 单个loader 可以使用 loader 去配置
        loader: 'eslint-loader',
        // 排除哪些？
        exclude: /node_modules/,
        // 检查哪些？
        include: resolve(__dirname, 'src'),
        // 优先执行
        enforce: 'pre', // 'post' 为延迟执行
        options:{}
      },
      {
        // 以下配置只会生效一个
        oneOf:[]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  mode: 'development'
}