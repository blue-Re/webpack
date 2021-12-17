# webpack笔记

## 一、Webpack简介

### 1.1webpack是什么

Webpack是一种前端资源构建工具，一个静态资源打包器，在Webpack看来，所有的资源文件都会作为模块处理，根据模块的依赖M关系进行静态分析，打包生成对应的静态资源（bundle）。



### 1.2webpack的五个核心概念

- Entry

  入口(Entry)指示webpack以哪个文件为入口起点开始打包，分析构建内部依赖图。

- Output

  输出(Output)指示webpack打包后的资源bundles输出到哪里去，以及如何命名。

- Loader

  Loder让webpack能够去处理那些非JavaScript文件

- Plugins

  插件(Plugins)可以用于执行范围更广的任务，插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量等。

- Mode

  ![image-20201219083601476](C:\Users\。\AppData\Roaming\Typora\typora-user-images\image-20201219083601476.png)

## 二、webpack的初次使用

- webpack的运行指令

  **开发环境：**`webpack ./src/index.js -o ./build/built.js --mode=development`

  webpack会以 `./src/index.js` 为入口文件开始打包，打包后输出到 `./build/built.js`

  **生产环境：**`webpack ./src/index.js -o ./built/built.js --mode=production`

  webpack会以 `./src/index.js` 为入口文件开始打包，打包后输出到`./build/built.js`

- 结论：

  1.webpack能处理js/json资源，不能处理css/img等其他资源

  2.生产环境和开发环境将ES6模块化编译成浏览器能识别的模块化

  3.生产环境比开发环境多一个压缩js代码

## 三、webpack打包资源

首先在src中将入口文件以及其他样式文件编写好，然后在项目中创建一个build文件夹，里边用来存放打包后的文件。然后在项目的根目录下，创建一个`webpack.config.js`文件，该文件为webpack的配置文件。且该配置文件需要引入`path`这个带三方包。



### 3.1webpack打包样式资源

**打包样式资源的操作是在loader配置中进行操作的，打包样式资源的配置文件的基本模板和配置项如下：**

**注：**但是，所有的打包命令都是在一些第三方包成功安装后才能正常运行，否则就会报错。

```js
/*
  webpack.config.js  webpack的配置文件
    作用：指示webpack干哪些活（当运行webpack指令时，会加载里面的配置）

    所有的构建工具都是基于node js 平台运行的~ 模块化采用common js
*/

// resolve用来拼接绝对路径的方法
const { resolve } = require('path')

module.exports = {
  // webpack配置
  // 入口起点
  entry:'./src/index.js',

  // 输出
  output:{
    filename:'built.js',// 输出文件名
    path:resolve(__dirname,'build')// 输出路径,__dirname代表当前文件的目录绝对路径
  },

  // loader的配置
  module:{
    rules:[
      // 详细loader配置
      {
        // 通过test匹配哪些文件（检测文件类型）
        test:/\.css$/,

        // 通过use来使用哪些loader对文件进行处理
        use:[
          // use数组中loader的执行顺序：从右往左，从下到上一,依次执行
          'style-loader', //创建style标签，将js中的样式资源插入进行，添加到head中生效
          'css-loader' //将css文件变成commonJs模块加载到js中，里面内容是样式字符串
        ]
      },
      // 不同文件必须配置不同loader处理
      {
        test:/\.less$/,
        use:[
          'style-loader',//创建style标签，将js中的样式资源插入进行，添加到head中生效
          'css-loader', //将css文件变成commonJs模块加载到js中，里面内容是样式字符串
          // 需要下载less和less-loader
          'less-loader' //将less文件编译成css文件
        ]
      }
    ]
  },

  // plugins的配置
  plugins:[
    // 详细plugins的配置

  ],

  // 模式
  mode:'development',
  // mode:'production'
}
```

然后再执行webpack命令对文件进行打包。



### 3.2webpack打包html资源

**打包html资源的操作是在plugins中进行的，且在使用之前，需要引入`html-webpack-plugin`第三方包**

**打包html资源的基本配置如下：**

```js
/* 
  loader: 1.下载 2.使用（配置loader）
  plugins：1.下载 2.引入 3.使用
*/

const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry:'./src/index.js',
  output:{
    filename:'built.js',
    path:resolve(__dirname,'build')
  },
  module:{
    rules:[
      // loader的配置

    ]
  },
  plugins:[
    // plugins的配置
    // html-webpack-plugin
    // 功能：默认会创建一个空的html，自动引入打包输出的所有资源(js、css)
    // 需求：需要有结构的html文件
    new HtmlWebpackPlugin({
      // 复制 './src/index.html' 文件,并自动引入打包输出的所有资源（js、css）
      template:'./src/index.html'
    })
  ],
  mode:'development'
}
```

### 3.3webpack打包图片资源

**打包图片资源是在module中进行的，其配置如下：**

```js
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
```

### 3.4webpack打包其他资源

**webpack打包其他资源也是在module中进行配置的，其配置如下：**

**以打包字体图标为例，需要将处理图标的css文件在index.js中事先导入，以及该css文件中的一些url地址的后缀名也需要复制到src下**

![image-20201221094036537](C:\Users\。\AppData\Roaming\Typora\typora-user-images\image-20201221094036537.png)

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {resolve} = require('path')

module.exports = {
  entry:'./src/index.js',
  output:{
    filename:'built.js',
    path:resolve(__dirname,'build')
  },
  module:{
    rules:[
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      },

      // 打包其他资源 除了（html，css，js）以外的资源
      {
        // 就是除了（html，css，js）
        exclude:/\.(css|js|html)$/,
        loader:'file-loader',
        options:{
          name:'[hash:10].[ext]'
        }
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
```

### 3.5配置devServer

devServer必须在项目打包后的路径下才能运行，而且浏览器需要在本地服务器的指定端口号才能显示。

![image-20201223130915330](C:\Users\。\AppData\Roaming\Typora\typora-user-images\image-20201223130915330.png)

![image-20201221100217851](C:\Users\。\AppData\Roaming\Typora\typora-user-images\image-20201221100217851.png)



### 3.6配置开发环境

配置如下：里边的**outputPath**是将导出后的文件放到对应的文件夹下。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {resolve} = require('path')

module.exports = {
  entry:'./src/js/index.js',
  output:{
    filename:'js/built.js',
    path:resolve(__dirname,'build'),
    publicPath:"./"
  },
  module:{
    rules:[
      // 处理less资源
      {
        test:/\.less$/,
        use:['style-loader','css-loader','less-loader']
      },
      // 处理css资源
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      },
      // 处理图片资源
      {
        test:/\.(jpg|png|gif)$/,
        loader:'url-loader',
        options:{
          limit:8 * 1024,
          name:'[hash:10].[ext]',
          // 关闭es6模块化，开启commonjs模块化
          esModule:false,
          outputPath:'img'
        }
      },
      // 处理html中的img
      {
        test:/\.html$/,
        loader:'html-loader'
      },
      // 处理其他资源
      {
        exclude:/\.(html|css|js|jpg|png|gif|less)/,
        loader:'file-loader',
        options:{
          name:'[hash:10].[ext]',
          outputPath:'media'
        }
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:'./src/index.html'
    })
  ],
  mode:'development',

  // 配置devServer
  // devServer:{
  //   contentBase:resolve(__dirname,'build'),
  //   compress:true,
  //   port:3000,
  //   open:true
  // }
}
```



### 3.7单独提取css文件

首先需要下载一个插件

```
npm i mini-css-extract-plugin -D
```

配置如下：

```js
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
          // 创建style标签，将样式放入
          // 'style-loader', 
          // 这个loader取代style-loader。作用：提取js中的css成单独文件
          MiniCssExtractPlugin.loader,
          // 将css文件整合到js文件中
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      // 对输出的css文件进行重命名
      filename: 'css/built.css'
    })
  ],
  mode: 'development'
};

```

### 3.8 兼容性处理

首先需要下载相关的依赖包

```
npm i postcss-loader postcss-preset-env -D
```

要在package.json添加如下配置

```
"browserslist": {
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ],
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ]
  },
```

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
      filename: 'css/main.css'
    })
  ],
  mode: 'development'
}
```



### 3.9使用Plugin来对打包的js文件压缩

![image-20201223130324218](C:\Users\。\AppData\Roaming\Typora\typora-user-images\image-20201223130324218.png)



### 3.10 压缩css

首先需要安装相关依赖

```
npm i optimize-css-assets-webpack-plugin
```

```js
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
```

### 3.11 js语法检查

首先需要安装相关依赖

```
npm i eslint-loader eslint eslint-config-airbnb-base eslint-plugin-import -D
```

在package.js当中，配置如下规则

```
"eslintConfig": {
	"extends": "airbnb-base"
}
```

想要eslint不检查一定的语法规范，需要在对应代码的上方加上一行注释，它可以忽略掉下一行的代码

```
// eslint-disable-next-line 
```

```js
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
```

### 3.12 js兼容性处理

首先需要安装对应的依赖

```
npm i babel-loader @babel/preset-env @babel/core -D
```

在rules的每个对象中的options选项中的presets要指示babel做什么样的兼容性处理

上面的情况只能是对普通的js语法进行处理，无法对promise等进行相应的转换

**如果想要对全部的js进行处理，需要安装下面的这个依赖**

```
npm i @babel/polyfill -D

// 它的使用是需要在源代码中引入即可
import '@babel/polyfill'
```

**上面的方法将所有的js代码全部转化，显然不是我门最想要的，我们希望的是按需转换，此时我们就需要安装下面的依赖**

注意，在使用第三种方式时，需要将第二种方式引入依赖库的代码注释掉！

```
npm i core-js -D
```

```js
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
```

==如果想要对js的代码进行压缩的话，只需要将 `mode` 调整为 `production`==

### 3.13 压缩html代码

压缩html代码需要引入`html-webpack-plugin`这个插件，然后需要配置一个`minify`的配置项，如下：

```js
const { resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // 压缩html代码，需要配置如下
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      }
    })
  ],
  mode: 'production'
}
```

### 3.14 生产环境配置

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 处理css为单独文件
const MinCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩css插件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

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
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
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
        // 对js做兼容性处理
        test: /\.js$/,
        exclude: /node_modules/,
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
          ]
        }
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
      filename: 'css/built.css'
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin()

  ],
  mode: 'production'
}
```

### 3.15 优化开发环境

`webpack.config.js`

```js
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
    open: true,
    hot: true
  },
  mode:'development'
}
```

`入口的js文件`

```js
import '../fa/css/all.css'
import '../css/index.less'
import print from './print'

function add(x,y) {  
  return x+y
}

console.log(add(1,2))

print()

// 加入这行代码
if (module.hot) {
  // 一旦 module.hot 为true，说明开启了HMR功能 --> 让HMR功能代码生效
  module.hot.accept('./print.js',()=> {
    // 该方法会监听 print.js 文件的变化，一旦发生变化，其他模块不会重新打包构建，
    // 会执行后边的回调函数
    print();
  })
}
```

### 3.16 source-map

开启资源映射的配置为`devtools: source-map`，它与webpack的五个核心概念为同一层级

```js
source-map：一种提供源代码到构建后代码的映射技术（可以通过构建代码的错误追踪到源代码的错误）
// devtools可选值为：
source-map: 外部
	错误代码准确信息 和 源代码的错误信息
inline-source-map: 内联
	只生成一个内联 source-map
	错误代码准确信息 和 源代码的错误位置
hidden-source-map: 外部
	错误代码错误的原因，但是没有错误位置
	不能追踪源代码的错误，只能提示到构建后代码的错误位置
eval-source-map:内联
	每一个文件都生成对应的source-map,都在eval
	错误代码准确信息 和 源代码的错误位置
nosources-source-map
	错误代码准确信息，但是没有任何源代码信息
cheap-source-map:外部
	错误代码准确信息，但是没有任何源代码信息 只能精确到行
cheap-module-source-map:外部
	错误代码准确信息 和 源代码的错误位置
	module会将loader和source map 加入
	
内联和外部的区别
	1. 外部生成了文件，内联没有
	2. 内联构建速度更快
	
开发环境：速度快，调试更友好
	速度快(eval>inline>cheap)
		eval-cheap-source-map
		eval-source-map
	调试更友好
		source-map
		cheap-module-source-map
		cheap-source-map
	--> evaluat-source-map / eval-cheap-module-source-map
	
生产环境：源代码是否隐藏，调试要不要更友好
	内联会让代码体积变大，所以在生产环境不用内联
	nosources-source-map 全部隐藏
	hidden-source-map 只隐藏源代码，会提示构建后代码错误信息
	--> source-map / cheap-module-source-map
```

### 3.17 OneOf

使用`OneOf`去优化时，不能有两个配置去处理同一种类型文件

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 处理css为单独文件
const MinCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩css插件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

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
    filename: 'js/built.js',
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
              ]
            }
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
      filename: 'css/built.css'
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin()

  ],
  mode: 'production'
}
```

### 3.18 缓存

缓存，对webpack构建缓存时，两种，一种是babel缓存，另外一种是文件资源缓存

```
babel缓存
	在配置babel的配置项中，在options的配置项中，设置：
	cacheDirectory:true
		目的：让第二次打包构建速度更快

文件资源缓存
	hash缓存: 每次webpack构建时会生成一个唯一的hash值
		问题？
			因为js、css同时使用一个hash值，导致每一次的重新打包，都会使得所有的缓存失效
	chunkhash: 根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样
		问题？
			js、css的hash值还是一样的
			因为css是在js中被引入的，所以属于同一个chunk
	contenthash：根据文件的内容生成hash值，不同文件的hash值一定不一样
		目的：让代码上线运行缓存更好使用
```

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 处理css为单独文件
const MinCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩css插件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

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
    new OptimizeCssAssetsWebpackPlugin()

  ],
  mode: 'production'
}
```

### 3.19 tree shaking 去除无用代码

```
前提：
	1. 必须使用ES6模块化
	2. 开启production环境
	
	在package.json 中配置
		“sideEffects”:false 所有代码都没有副作用 （都可以进行 tree shaking）
		问题：可能会把 css/ @babel/polyfill 文件干掉
		解决：
			添加如下配置
		“sideEffects”:["*.css", "*.less"]
```

### 3.20 code split 代码分割

#### 第一种情况

使用多入口打包，有几个入口，就会生成多个chunk文件

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // 单入口
  // entry: './js/index.js',
  entry: {
    // 多入口，entry为一个对象
    // 有几个入口，最终输出就有几个 bundle
    index: './js/index.js',
    test: './js/test.js'
  },
  output: {
    // [name]: 取文件名
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build')
  },
  module:{},
  plugins:[
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ],
  mode: 'production'
}
```

#### 第二种情况

使用一个webpack配置

```
// 增加如下配置项，与plugins为同一级
// 增加如下配置项
  /* 
    1. 可以将node_modules中代码单独打包成一个chunk最终输出
    2. 自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独的一个chunk
  */
optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
```



```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // 单入口
  // entry: './js/index.js',
  entry: {
    // 多入口，entry为一个对象
    index: './js/index.js',
    test: './js/test.js'
  },
  output: {
    // [name]: 取文件名
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build')
  },
  module:{},
  plugins:[
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ],
  // 增加如下配置项
  /* 
    1. 可以将node_modules中代码单独打包成一个chunk最终输出
    2. 自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独的一个chunk
  */
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  mode: 'production'
}
```

#### 第三种情况

单入口，使用 js 去动态引入并打包

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // 单入口
  entry: './js/index.js',
  output: {
    // [name]: 取文件名
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build')
  },
  module:{},
  plugins:[
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ],
  // 增加如下配置项
  /* 
    1. 可以将node_modules中代码单独打包成一个chunk最终输出
    2. 自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独的一个chunk
  */
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  mode: 'production'
}
```

```js
// test.js 文件
function add(x, y) {  
  return x + y;
}
console.log(add(4, 5));

/* 
  通过js代码，让某个文件被单独打包成一个chunk
  import 动态导入语法：能将某个文件单独打包
*/

/* webpackChunkName:'test' */ // 可以重命名打包后的文件名
import(/* webpackChunkName:'test' */'./test')
  .then((result) => {
    // 文件加载成功
    console.log(result);
  })
  .catch(() => {
    console.log('文件加载失败');
  })
```

### 3.21 懒加载与预加载

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // 单入口
  entry: './js/index.js',
  output: {
    // [name]: 取文件名
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build')
  },
  module:{},
  plugins:[
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ],
  // 增加如下配置项
  /* 
    1. 可以将node_modules中代码单独打包成一个chunk最终输出
    2. 自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独的一个chunk
  */
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  mode: 'production'
}
```

```js
console.log('index被加载了');

/* 
  懒加载： 当前文件需要使用时才加载

  预加载 prefetch 会在使用之前，提前加载js文件
  	webpackPrefetch: true 开启预加载 兼容性较差

  正常加载可以是并行加载（同一时间加载多个文件）
  预加载：等其他资源加载完毕，浏览器空闲了才回去加载资源
*/
document.getElementById('btn').onclick = ()=>{
  // 懒加载
  // import(/* webpackChunkName: 'test'*/'./test').then(({increment})=>{
  //   console.log(increment(1, 2));
  // })
  // 这块是预加载
  import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test').then(({increment})=>{
    console.log(increment(1, 2));
  })
}
```

### 3.22 PWA 渐进式网络开发应用程序（离线可访问）

首先需要安装对应的依赖

```
npm i workbox-webpack-plugin -D
```

```
在webpack.config.js中使用这个插件
new WorkboxWebpackPlugin.GenerateSW({
      /* 
        1. 帮助serviceWorker快速启动
        2. 删除旧的 serviceWorker

        生成一个 serviceWorker的文件
      */
      clientsClaim: true,
      skipWaiting: true
    })
    
问题？
    1. eslint 不认识 window、navigator 全局变量
      解决：需要修改 package.json中eslintConfig配置
      "env": {
        "browser":true // 支持浏览器端全局变量
      }
    2. serviceWorker 代码必须跑在服务器上
```

```
在index.js入口文件

// 注册 serviceWorker
// 处理兼容性问题
if ('serviceWorker' in navigator) {
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('/service-worker.js')
      .then(()=>{
        console.log('注册成功了');
      })
      .catch(()=>{
        console.log('注册失败了');
      })
  })
}
```

### 3.23 多进程打包

首先需要下载相关依赖包

```
npm i thread-loader -D
```

这个loader一般是给babel-loader去使用

```js
// thread-loader 会对其后面的 loader 进行多进程 打包
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
```

### 3.24 externals 忽略打包资源

当我们有时希望引入的包是通过cdn的方式所引入，不想让webpack将其打包，可以配置`externals`这个配置

```js
/* 
  loader: 1.下载 2.使用（配置loader）
  plugins：1.下载 2.引入 3.使用
*/

const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      // loader的配置

    ]
  },
  plugins: [
    // plugins的配置
    // html-webpack-plugin
    // 功能：默认会创建一个空的html，自动引入打包输出的所有资源(js、css)
    // 需求：需要有结构的html文件
    new HtmlWebpackPlugin({
      // 复制 './src/index.html' 文件,并自动引入打包输出的所有资源（js、css）
      template: './src/index.html'
    })
  ],
  externals: {
    // 拒绝 jq 打包进来
    jQuery: "jQuery"
  },
  mode: 'development'
}
```

### 3.25 dll 打包资源

有时我们希望一些第三方包只打包一次，之后就不需要打包了，这个时候就需要用到 dll 去打包

需要安装一个插件

```
npm i add-asset-html-webpack-plugin -D
```

```js
webpack.config.js

/* 
  loader: 1.下载 2.使用（配置loader）
  plugins：1.下载 2.引入 3.使用
*/

const { resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    // plugins的配置
    // html-webpack-plugin
    // 功能：默认会创建一个空的html，自动引入打包输出的所有资源(js、css)
    // 需求：需要有结构的html文件
    new HtmlWebpackPlugin({
      // 复制 './src/index.html' 文件,并自动引入打包输出的所有资源（js、css）
      template: './src/index.html'
    }),
    // 告诉webpack哪些库不参与打包，同时使用时的名称也得变
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json')
    }),
    // 将某个文件打包输出，并在html文件当中自动引入
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, 'dll/jquery.js')
    })
  ],
  mode: 'development'
}
```

```js
webpack.dll.js

/* 
  使用dll 打包，会将某些第三方库 进行单独打包

  当运行 webpack 指令时 默认会去运行 webpack.config,js
  需要执行以下指令去运行 webpack.dll.js
    webpack --config webpack.dll.js
*/
const { resolve } = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    // 最终打包生成的[name]--> jquery
    // ['jquery]--> 要打包的库是 jquery
    jquery: ['jquery']
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dll'),
    library: '[name]_[hash]' // 打包的库里面向外暴露出去的内容的名字
  },
  plugins: [
    // 打包生成一个 manifest.json --> 提供和 jquery 映射
    new webpack.DllPlugin({
      name: '[name]_[hash]', // 映射库的暴露名称
      path: resolve(__dirname, 'dll/manifest.json')
    })
  ],
  mode: 'production'
}
```

## 四、webpack详解

### 4.1 entry入口详解

entry入口文件，有以下几种形式

1. 入口为`string` ==> `./src/index.js`

   单入口，打包形成一个chunk，输出一个bundle文件，chunk的名称默认为main

2. 入口为`array` ==> `['./src/index.js','./src/add.js']`

   多入口，但是在同一个数组里边，所以最终会形成一个chunk，输出只有一个bundle文件

   ==只有在HMR功能中让 html 热更新生效==

3. 入口为`object`

   多入口，形式为 `{ index: './src/index.js', test: './src/test.js'}`这种格式

   有几个入口文件就会形成几个chunk，输出几个bundle文件，输出的文件名为 key

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // 入口为字符串
  // entry: './src/index.js',
  // 入口为数组
  // entry: ['./src/index.js', './src/test.js'],
  // 入口为object
  entry: {
    index: './src/index.js',
    two: ['./src/decrement.js', './src/test.js']
  },

  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'build')
  },
  module: {},
  plugins: [
    new HtmlWebpackPlugin()
  ],
  mode: 'development'
}
```

### 4.2 output 详解

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',

  output: {
    // 打包后的文件名
    filename: 'built.js',
    // 打包后文件的输出路径
    path: resolve(__dirname, 'build'),
    // 所有资源引入公共路径前缀
    publicPath: '/',
    // 非入口的chunk的名
    chunkFilename: '[name]_chunk.js',
    // 整个库向外暴露的变量名
    // library: '[name]',
    // 变量添加在哪
    // libraryTarget: 'window' // 变量名添加在 browser上
    // libraryTarget: 'global' // 变量名添加在 node 上
  },
  module: {},
  plugins: [
    new HtmlWebpackPlugin()
  ],
  mode: 'development'
}
```

### 4.3 module详解

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
      {
        test: /\.js/,
        // 单个loader 可以使用 loader 去配置
        loader: 'eslint-loader',
        // 排除哪些？
        exclude: /node_modules/,
        // 检查哪些？
        include: resolve(__dirname, 'src'),
        // 优先执行
        enforce: 'pre', // 'post' 为延迟执行
        options:{}
      },
      {
        // 以下配置只会生效一个
        oneOf:[]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  mode: 'development'
}
```

### 4.4 resolve 解析模块规则详解

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
  mode: 'development',
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
}
```

### 4.6 devServer 详解

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
  mode: 'development',
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
  }
}
```

### 4.7 optimization详解

```js
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
```

## 五、webpack5

关于webpack5的一些写法，这里主要是对loader的理解

`loaderOne.js`

```js

// loader的本质是一个函数

// 同步 loader
// 第一种同步执行的写法
// module.exports = function (content, map, meta) {
//   console.log('11111111');
  
//   return content
// }

// 第二种同步执行的写法
module.exports = function (content, map, meta) {
  console.log(111);

  this.callback(null, content, map, meta)
}

// 每次解析loader都会去执行对应的pitch方法
module.exports.pitch = function () {
  console.log('pitch 111111');
}

```

`loaderTwo.js`

```js

// loader的本质是一个函数
// 同步loader
// module.exports = function (content, map, meta) {
//   console.log('22222222');

//   return content
// }

// 异步loader(推荐使用)
module.exports = function (content, map, meta) {
  console.log(222);

  const callback = this.async()

  setTimeout(() => {
    callback(null, content)
  }, 1000)
}

// 每次解析loader都会去执行对应的pitch方法
module.exports.pitch = function () {
  console.log('pitch 222');
}
```

`loaderThree.js`

```js
const { getOptions } = require('loader-utils')
// 这个库专门用来验证 loader 是否符合规范
const { validate } = require('schema-utils')
const schema = require('./schema.json')

// loader的本质是一个函数
module.exports = function (content, map, meta) {
  /* 有时我们需要知道loader的配置项，需要去下载一个 npm i loader-utils -D */
  const options = getOptions(this);
  console.log('333333', options);

  // 校验 options 是否合法
  validate(schema, options, {
    name: 'loaderThree'
  })
  return content
}

// 每次解析loader都会去执行对应的pitch方法
module.exports.pitch = function () {
  console.log('pitch 333');
}
```

`webpack.config.js`

```js
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
```

匹配规则的 `schema.json`文件

```json

{
  "type": "object",
  "properties": {
    "name": {
      "type" : "string",
      "description": "名称"
    }
  },
  "additionalProperties": true
}
```

## 六、自定义 babelLoader

`babelLoader.js`

```js
// 自定义的 babelLoader

// 获取 options 的配置
const { getOptions } = require('loader-utils')
const { validate } = require('schema-utils')
const babel = require('@babel/core')
const util = require('util')

const babelSchema = require('./babelLoaderSchema.json')

// babel.transform 用来编译代码的方法，是一个普通异步方法
// util.promisify 将普通异步方法转化成基于promise的异步方法
const transform = util.promisify(babel.transform)

module.exports = function (content, map, meta) {
  // 获取 loader 的 options 配置
  const options = getOptions(this) || {};
  // 校验 babelLoader 
  validate(babelSchema, options, {
    name: 'Babel Loader'
  })

  // 创建异步
  const callback = this.async()

  // 使用 babel 编译代码
  transform(content, options)
    .then(({code, map}) => callback(null, code, map, meta))
    .catch((e) => callback(e))
}
```

loader匹配规则

```json
{
  "type": "object",
  "properties": {
    "presets": {
      "type": "array"
    }
  },
  "additionalProperties": true
}
```

`webpack.config.js`

```js
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
```

## 七、tapable的使用

首先需要安装相关依赖

```
npm i tapable -D
```

```js
const { SyncHook, SyncBailHook, AsyncParallelHook, AsyncSeriesHook } = require('tapable')

class Lesson {
  constructor() {
    // 初始化 hooks容器
    this.hooks = {
      // 同步 hooks 任务依次执行 
      // go: new SyncHook(['address']) 
      go: new SyncBailHook(['address']), // 一旦遇到返回值就停止执行

      // 异步 hooks
      // AsyncParallelHook 异步并行
      // leave: new AsyncParallelHook(['name', 'age']),

      // AsyncSeriesHook 异步串行 先执行一个再执行一个
      leave: new AsyncSeriesHook(['name', 'age'])
    }
  }
  tap() {
    // 往hooks容器中注册 事件/ 添加回调函数
    this.hooks.go.tap('class0318', (address) => {
      console.log('class0318', address);
    })
    this.hooks.go.tap('class0410', (address) => {
      console.log('class0410', address);
    })
    // 第一种异步调用方法
    this.hooks.leave.tapAsync('class0510', (name, age, callback) => {
      setTimeout(() => {
        console.log('class0510', name, age);
        callback()
      }, 2000)
    })
    // 第二种异步调用方法
    this.hooks.leave.tapPromise('class0510', (name, age) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('class0610', name, age);
          resolve()
        }, 1000)
      })
    })
  }
  start() {
    // 触发 hooks(会触发容器内所有钩子)
    this.hooks.go.call('c318')
    this.hooks.leave.callAsync('jack', 19, function () {
      // 代表 leave 容器 所有的钩子都触发完毕
      console.log('leave 容器中所有的钩子触发完毕');
    })
  }
}

const l = new Lesson()
l.tap()
l.start()
```

## 八、complier的hooks的使用

```js
class PluginOne {
  // 在 new 调用 插件时 会触发 apply 这个方法
  apply(complier) {
    complier.hooks.emit.tap('PluginOne', (compilation) => {
      console.log('emit.tap');
    })

    complier.hooks.emit.tapAsync('PluginOne', (compilation, callback) => {
      setTimeout(() => {
        console.log('tapAsync.tap');
        callback()
      }, 1000)
    })

    complier.hooks.emit.tapPromise('PluginOne', (compilation) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('tapAsync.tap');
          resolve()
        }, 1000)
      })
    })

    complier.hooks.afterEmit.tap('PluginOne', (compilation) => {
      console.log('afterEmit.tap');
    })

    complier.hooks.done.tap('PluginOne', (compilation) => {
      console.log('done.tap');
    })
  }
}

module.exports = PluginOne
```

```js
const PluginOne = require('./plugins/PluginOne')

module.exports = {
  plugins:[
    new PluginOne()
  ]
}
```

## 九、compilation的使用

```js
const PluginTwo = require('./plugins/PluginTwo')
module.exports = {
  plugins:[
    new PluginTwo()
  ]
}
```

```js
const fs = require('fs')
const util = require('util')
const path = require('path')

const webpack = require('webpack')
// RawSource可以将 数据变成对象
const { RawSource } = webpack.sources

// 将fs.readFile方法变成基于 promise 风格的异步方法
const readFile = util.promisify(fs.readFile)

class PluginTwo {
  apply(compiler) {
    // 初始化 compilation 钩子
    compiler.hooks.thisCompilation.tap('PluginTwo', (compilation) => {
      // 添加资源
      compilation.hooks.additionalAssets.tapAsync('PluginTwo', async (callback) => {
        const content = 'hello plugin two'

        // 往输出的资源中，添加一个 a.txt
        compilation.assets['a.txt'] = {
          // 文件大小
          size() {
            return content.length;
          },
          // 文件内容
          source() {
            return content;
          }
        }

        const data = await readFile(path.resolve(__dirname, 'b.txt'))
        // 第一种
        // compilation.assets['b.txt'] = new RawSource(data)

        compilation.emitAsset('b.txt', new RawSource(data))
        callback()
      })
    })
  }
}

module.exports = PluginTwo
```

## 十、自定义copy-webpack-plugin

`webpack.config.js`

```js
const CopyWebpackPlugin = require("./plugins/CopyWebpackPlugin");


module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      from: 'public',
      to: 'css',
      ignore:['**/index.html']
    })
  ]
}
```

`CopyWebpackPlugin.js`

```js
// 写一个插件 将 public 的资源复制到dist文件夹下

const { validate } = require('schema-utils')
const schema = require('./schema.json')
// 专门用来匹配文件列表
const globby = require('globby')
const path = require('path')
const { promisify } = require('util')

const webpack = require('webpack')

const { RawSource } = webpack.sources
const readFile = promisify(fs.readFile)


class CopyWebpackPlugin {
  constructor(options = {}) {
    // 验证options是否符合规范
    validate(schema, options, {
      name: "CopyWebpackPlugin"
    })
    this.options = options
  }

  apply(compiler) {
    // 初始化compilation
    compiler.hooks.thisCompilation.tap('CopyWebpackPlugin', (compilation) => {
      // 添加资源的 hooks
      compilation.hooks.additionalAssets.tapAsync('CopyWebpackPlugin', async callback => {
        // 将 from 中的资源复制到 to 中，输出出去
        const { from, ignore } = this.options;
        const to = this.options.to ? this.options.to : '.'

        // context 就是 webpack 的配置
        // 运行指令的目录
        const context = compiler.options.context;
        // 将输入路径变为绝对路径
        const absoluteFrom = path.isAbsolute(from) ? from : path.resolve(context, from);

        // 1. 过滤掉 ignore的文件
        // globby(要处理的文件夹，options)
        const paths = await globby(absoluteFrom, { ignore }) // 所有要加载的文件路径数组
        // 2. 读取 paths 中所有资源
        const files = await Promise.all(
          paths.map(async absolutePath => {
            // 读取文件
            const data = await readFile(absolutePath)
            // basename 得到最后的文件名称
            const relativePath = path.basename(absolutePath)

            const filename = path.join(to, relativePath)
            
            return {
              // 文件数据
              data,
              //文件名称
              filename
            }
          })
        )
        // 3. 生成webpack格式的资源
        const assets = files.map(file => {
          const source = new RawSource(file.data)
          return {
            source,
            filename: file.filename
          }
        })
        // 4. 添加compilation中，输出出去
        assets.forEach(asset => {
          compilation.emitAsset(asset.filename, asset.source)
        })
        callback()
      })
    })
  }
}

module.exports = CopyWebpackPlugin
```

`schema.json`

```js
{
  "type": "object",
  "properties": {
    "from": {
      "type": "string"
    },
    "to": {
      "type": "string"
    },
    "ignore": {
      "type": "array"
    }
  },
  "additionalProperties": false
}
```

## 十一、自定义MyWebpack

**webpack的执行流程**

1. 初始化 `Compiler: new Webpack(config) 得到 Compiler 对象`
2. 开始编译：调用 `Compiler`对象 run 方法 开始执行那个编译
3. 确定入口：根据配置中的entry入口找出所有的入口文件
4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行编译，再找出该模块依赖的模块，递归直到所有模块被加载进来
5. 完成模块编译：在经过第4步使用 Loader 编译完所有模块后，得到了每个模块被编译后的最终内容以及他们之间的依赖关系。
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个Chunk 转换成一个单都的文件加入到输出列表。（**注意：这步是可以修改输出内容的最后机会**）
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

