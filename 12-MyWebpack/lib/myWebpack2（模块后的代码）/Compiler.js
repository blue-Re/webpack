const { getAst, getDeps, getCode } = require('./parser')
class Compiler {
  constructor(options = {}) {
    this.options = options
  }
  // 启动webpack打包的方法
  run() {
    // 1.读取入口文件内容
    // 入口文件路径
    const filePath = this.options.entry;
    // 1.将文件解析ast
    const ast = getAst(filePath)
    // 2.获取ast中所有依赖
    const deps = getDeps(ast, filePath)
    // 3. 将ast解析成code
    const code = getCode(ast)

    console.log(ast);
    console.log(deps);
    console.log(code);
  }
}

module.exports = Compiler