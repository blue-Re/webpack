const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      /* 
        js的兼容性处理
          1. 基本的js兼容性处理 --> @babel/preset-env
            问题：只能转换基本语法，比如promise不可以转换
          2. 全部js兼容新处理 --> @babel/polyfill
            问题：将所有兼容性代码全部引入
          3. 按需加载，不要全部加载 --> core-js
            注意：当我们使用第三种方式时，需要把第二种方式引入的代码注释掉
      */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 预设，指示babel做怎么样的处理
          /* presets: [
            '@babel/preset-env',
            {
              // 按需加载
              userBuiltIns: 'usage',
              // 指定core-js版本
              corejs: {
                version: 3
              },
              // 指定兼容性做到哪个版本的浏览器
              targets: {
                chrome: '60',
                firefox: '60',
                ie: '9',
                safari: '10',
                edge: '17'
              }
            }] */
          presets: [
            ["@babel/preset-env", {
              "userBuiltIns": "usage",
              "corejs": {
                "version": 3
              },
              "targets": {
                "chrome": "60",
                "firefox": "60",
                "ie": "9",
                "safari": "10",
                "edge": "17"
              }
            }]
          ]
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  mode: 'development'
}