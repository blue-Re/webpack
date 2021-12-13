/* 
  HMR ：hot module replacement（热模块替换、热模块更新）
    作用：一个模块发生变化，指挥重新打包这一个模块（而不是所有模块）提升构建速度

  样式文件：可以使用HMR功能，引文 style-loader 内部实现了这个功能
  js文件：默认不能使用HMR共嗯那个--> 需要修改js代码，添加HMR功能的代码
    注意：HMR功能对js的处理，只能处理非入口js文件的其他文件
  html文件：默认不能使用HMR共嗯，同时会导致问题：html文件不能热更新了~
    解决：修改entry入口，将html文件引入

  // 开启热更新需要在devServer中添加 hot:true的配置项
*/


const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: ['./src/js/index.js', './src/index.html'],
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      // 处理less
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      // 处理css
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // 处理图片资源(只能处理样式中的资源)
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: '[hash:10].[ext]',
          // 关闭es6模块化
          esModule: false,
          outputPath:'imgs'
        }
      },
      // 处理html中的资源
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      // 处理其他资源
      {
        exclude: /\.(html|js|css|less|jpg|png|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath:'imgs'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    contentBase: resolve(__dirname,'build'),
    compress: true,
    port: 3000,
    open: true
  },
  mode:'development'
}