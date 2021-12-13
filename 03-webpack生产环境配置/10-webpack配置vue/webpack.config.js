const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');
// const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build'),
    publicPath: "./"
  },
  module: {
    rules: [
      // 处理css资源
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    // new VueLoaderPlugin()
  ],
  mode: 'development',
  resolve: {
    extensions:['.js','.css','.vue'],//省略后缀名
    // alias:别名
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
  }
}