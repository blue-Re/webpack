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