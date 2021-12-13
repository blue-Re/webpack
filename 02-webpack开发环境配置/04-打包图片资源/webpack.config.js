const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry:'./src/index.js',
  output:{
    filename:'built.js',
    path:resolve(__dirname,'build'),
    publicPath:"./"
  },
  module:{
    rules:[
      {
        test:/\.less$/,
        // 要是用多个loader处理用use
        use:['style-loader','css-loader','less-loader']
      },
      // 问题：默认处理不了html中的img图片
      // 处理图片资源
      {
        test:/\.(jpg|png|gif)$/,
        // 使用一个loader
        // 下载url-loader file-loader
        loader:'url-loader',
        options:{
          // 图片小于8kb，就会被base64处理
          // 优点：减少请求数量（减轻服务器压力）
          // 缺点:图片体积会更大(文件请求速度更慢)
          limit:8*1024,

          // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
          // 所以解析时会出现：[object Module]
          // 解决：关闭url-loader的es6模块化，使用commonjs解析
          esModule:false,

          // 打包解析后图片的生成名字是图片的哈希值，我们不希望图片名字那么长
          // 所以给图片进行重命名
          // [hash:10] 代表的是取图片的hash值的前10位
          // [ext]取文件原来扩展名
          name:'[hash:10].[ext]'

        }
      },
      {
        test:/\.html$/,
        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
        loader:'html-loader'
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:'./src/index.html'
    })
  ],
  mode:'development'
}