const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 处理css为单独文件
const MinCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩css插件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// 离线缓存技术
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

// 决定使用browserslist的哪个环境
process.env.NODE_ENV = 'production';

// 复用loader
const commonCssLoader = [
  MinCssExtractPlugin.loader,
  'css-loader',
  {
    // 还需要在package.json中定义browserslist
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [
        require('postcss-preset-env')()
      ]
    }
  }
]
module.exports = {
  entry: './src/index.js',
  output: {
    // filename: 'js/built.[hash:10].js',
    // filename: 'js/built.[chunkhash:10].js',
    filename: 'js/built.[contenthash:10].js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      // 把 eslint 单独提取出来
      {
        // 在 package.json中 eslintConfig --> airbnb
        test: /\.js$/,
        exclude: /node_modules/,
        // 优先执行
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        // 以下loader只会配置一个
        // 注意：不能有两个配置处理同一种类型文件
        oneOf: [
          // 处理css资源
          {
            test: /\.css$/,
            use: [
              ...commonCssLoader
            ]
          },
          {
            test: /\.less$/,
            use: [
              ...commonCssLoader,
              'less-loader'
            ]
          },
          // 处理js资源
          /* 
            通常情况下，一个文件只能被一个loader去处理，
            当一个文件被多个loader去处理的时候，需要指定loader的执行顺序
              先执行eslint 在执行babel
          */
          {
            // 对js做兼容性处理
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'thread-loader',
                options: {
                  workers: 2, // 进程为2个
                }
              },
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        corejs: { version: 3 },
                        targets: {
                          chrome: '60',
                          firefox: '50'
                        }
                      },
                    ]
                  ],
                  // 开启babel缓存
                  // 第二次构建时，会读取之前的缓存
                  cacheDirectory: true
                }
              }
            ],

          },
          // 处理图片资源
          {
            test: /\.(jpg|png|gif)/,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              name: '[hash:10].[ext]',
              outputPath: 'imgs',
              esModule: false
            }
          },
          // 检测html文件
          {
            test: /\.html$/,
            loader: 'html-loader'
          },
          {
            exclude: /\.(js|css|html|less|jpg|png|gif)/,
            loader: 'file-loader',
            options: {
              outputPath: 'media'
            }
          }
        ]
      },
    ]
  },
  plugins: [
    // 解析模板
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // 对html进行压缩
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    // 处理css为单独文件
    new MinCssExtractPlugin({
      // filename: 'css/built[hash:10].css'
      // filename: 'css/built[chunkhash:10].css'
      filename: 'css/built[contenthash:10].css'
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
    new WorkboxWebpackPlugin.GenerateSW({
      /* 
        1. 帮助serviceWorker快速启动
        2. 删除旧的 serviceWorker

        生成一个 serviceWorker的文件
      */
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  mode: 'production'
}