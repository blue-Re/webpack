const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // loader: path.resolve(__dirname, 'loaders', 'loaderOne')
        // loader: 'loaderOne'

        // 解析 loader 会按照从上往下的顺序执行，每次解析 loader 就会去调用对应 loader 的 pitch 方法
        use: [
          'loaderOne',
          'loaderTwo',
          {
            loader: 'loaderThree',
            options: {
              name: 'zhangsan'
            }
          }
        ]
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