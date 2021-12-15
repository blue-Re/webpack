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