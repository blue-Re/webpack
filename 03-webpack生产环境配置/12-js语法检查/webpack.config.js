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
      /* 所有的语法检查都在module的rules中来配置 */
      /* 语法检查：eslint-loader eslint */
      /* 注意：只检测自己写的源代码，第三方的库是不用检查 */
      /* 设置检查规则：
        package.json 中 eslintConfig中设置
          "eslintConfig": {
          "extends": "airbnb-base"
        }
        airbnb--> eslint-config-airbnb-base eslint eslint-plugin-import
      */
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      options: {
        // 自动修复 eslint 的错误
        fix: true
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