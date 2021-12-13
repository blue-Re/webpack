const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 设置node的环境变量
// 开发环境 设置 node的环境变量 : process.env.NODE_ENV = 'development'
process.env.NODE_ENV = 'development'

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          // 这个插件默认会取代 style-loader 作用：提取css为单独文件
          MiniCssExtractPlugin.loader,
          'css-loader',
          /* 
            CSS兼容性的处理：postcss --> postcss-loader postcss-preset-env
            作用：帮助postcss找到package.json中browserslist里面的配置，通过配置加载指定多个css兼容性样式
          
            // 使用loader的默认配置 'postcss-loader'
            */
          // 修改loader的配置
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                // postcss的插件
                require('postcss-preset-env')()
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      // 对输出的文件进行重命名
      filename: 'css/built.css'
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin()
  ],
  mode: 'development'
}