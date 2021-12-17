const { getAst, getDeps, getCode } = require('./parser')
const fs = require('fs')
const path = require('path')

class Compiler {
  constructor(options = {}) {
    // webpack配置对象
    this.options = options
    // 所有依赖容器数组
    this.modules = []
  }
  // 启动webpack打包的方法
  run() {
    // 入口文件路径
    const filePath = this.options.entry;
    // 第一次构建，得到入口文件的信息
    const fileInfo = this.build(filePath)
    this.modules.push(fileInfo)
    // 遍历所有依赖
    this.modules.forEach(fileInfo => {
      // 去除当前文件的所有依赖
      const deps = fileInfo.deps;
      // 遍历
      for (const relativePath in deps) {
        // 依赖的文件的绝对路径
        const absolutePath = deps[relativePath]
        // 对文件依赖进行处理
        const fileInfo = this.build(absolutePath)
        // 将处理后的结果添加到 modules中，后面遍历就会遍历他了
        this.modules.push(fileInfo)
      }
    })
    console.log(this.modules);

    // 将依赖整理成更好的依赖关系图
    const depsGraph = this.modules.reduce((graph, module) => {
      return {
        ...graph,
        [module.filePath]: {
          code: module.code,
          deps: module.deps
        }
      }
    }, {})

    this.generate(depsGraph)
  }
  // 开始构建
  build(filePath) {
    // 1.将文件解析ast
    const ast = getAst(filePath)
    // 2.获取ast中所有依赖
    const deps = getDeps(ast, filePath)
    // 3. 将ast解析成code
    const code = getCode(ast)

    console.log(ast);
    console.log(deps);
    console.log(code);

    return {
      filePath,// 文件路径
      deps, // 当前文件的所有依赖
      code, // 当前文件解析后的代码
    }
  }
  // 构建资源输出的方法
  generate(depsGraph) {
    const bundle = `
      (function (depsGraph) {
        // require目的: 为了加载入口文件
        function require(module) {
          // 定义模块内部的require函数
          function localRequire(relativePath) {
            // 为了找到要引入的绝对路径,通过require加载
            return require(depsGraph[module].deps[relativePath])
          }
          // 定义暴露对象，将来模块要暴露的内容
          var exports = {};

          (function (require,exports,code) {
            eval(code);
          })(localRequire, exports, depsGraph[module].code)

          // 作为require函数的返回值返回出去
          // 后面的require函数能得到暴露的内容 
          return exports;
        }
        // 加载入口文件
        require('${this.options.entry}');
      })(${JSON.stringify(depsGraph)})
    `
    // 生成输出文件的绝对路径
    const filePath = path.resolve(this.options.output.path, this.options.output.filename)
    // 写入文件
    fs.writeFileSync(filePath, bundle, 'utf-8')
  }
}

module.exports = Compiler