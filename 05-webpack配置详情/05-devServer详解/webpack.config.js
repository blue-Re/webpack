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
  devServer: {
    contentBase: resolve(__dirname, 'build'), // 运行的代码目录
    watchContentBase: true, // 监视 contentBase 目录下的所有文件，一旦变化就重新 reload
    watchOptions: {
      ignored: /node_modules/, // 忽略文件
    },
    compress: true, // 启动 gzip 压缩
    port: 8000, // 端口号
    host: 'localhost', // 域名
    open: true, // 默认打开浏览器
    hot: true, // 开启热更新
    clientLogLevel: 'none', // 不显示启动服务器日志信息
    quiet: true, // 除了一些基本功能意外，其他内容都不显示
    overlay: false, // 如果出现错误，不要全屏提示
    proxy: {
      // 一旦 devServer (8000) 服务器接受到 /api/xx 的请求 就会把请求转发到另外一个服务器 (3000)
      '/api': {
        target: 'http://localhost:3000',
        // 路径重写
        pathRewrite: {
          '^api': ''
        }
      }
    }
  }
}