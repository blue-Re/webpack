const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

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
  mode: 'production',
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
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      // 默认值，一般不修改
      /* minSize: 30 * 1024, // 分割的 chunk 最小为 30kb
      maxSize: 0, // 最大没有限制
      minChunks: 1, // 要提起的chunk 最少被引用 1次
      maxAsyncRequests: 5, // 按需加载时并行加载的文件的最大数量
      maxInitialRequests: 3, // 入口的js文件最大并行请求数量
      automaticNameDelimiter: '~', // 名称连接符
      name: true, // 可以使用命名规则
      cacheGroups: { // 分割 chunk 的组
        // node_modules 文件会被打包到 vendors 组的chunk中 --> vendors~xxx.js
        // 满足上面的公共规则: 如：大小超过30kb，至少被引用一次
        vendors:{
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 打包的优先级
        },
        default: {
          // 要提取的chunk最少被引用两次
          minChunks:2,
          priority: -20, // 打包的优先级
          reuseExistingChunk: true, // 如果当前要打包的模块和之前已经被提取的模块是同一个，就会服用，而不是重新打包
        }
      } */
    },
    // 将当前模块的记录其他模块的 hash 单独打包为一个文件 runtime
    // 解决 修改a文件导致b文件的contenthash变化
    runtimeChunk: {
      name: entrypoint => `runtime=${entrypoint.name}`
    },
    minimizer: [
      // 配置生产环境的压缩方案 js\css
      // 需要下载 npm i terser-webpack-plugin -D
      new TerserWebpackPlugin({
        cache: true, // 开启缓存
        parallel: true, // 开启多进程打包
        sourceMap: true // 启动source-map
      })
    ]
  },
}