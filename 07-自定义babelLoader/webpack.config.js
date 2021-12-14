const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babelLoader',
        options: {
          presets: [
            '@babel/preset-env'
          ]
        }
      }
    ]
  },
  // 配置解析loader规则
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'loaders'), // 解析路径
    ]
  },
  mode: 'development'
}