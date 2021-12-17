const fs = require('fs')
const path = require('path')

const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { transformFromAst } = require('@babel/core')



const parser = {
  // 获取抽象语法树代码
  getAst(filePath) {
    // 读取文件
    const file = fs.readFileSync(filePath, 'utf-8')
    // 将其解析成ast抽象语法树
    const ast = babelParser.parse(file, {
      sourceType: 'module' // 解析文件的模块化方案是 ES MOdule
    })
    return ast
  },
  // 获取依赖
  getDeps(ast, filePath) {
    // 获取到文件文件夹路径
    const dirname = path.dirname(filePath)
    // 定义存储依赖的容器
    const deps = {}
    // 收集依赖
    traverse(ast, {
      // 内部遍历 ast 中 program.body,判断里面语句类型
      // 如果 type: ImportDeclaration 就会触发当前函数
      ImportDeclaration({ node }) {
        // 文件相对路径 ： './add.js'
        const relativePath = node.source.value;
        // 生成基于入口文件的绝对路径
        const absolutePath = path.resolve(dirname, relativePath)

        // 添加依赖
        deps[relativePath] = absolutePath;
      }
    })
    console.log(deps);
    return deps
  },
  // 将ast解析成code
  getCode(ast) {
    // 编译代码 将ES6语法进行编译处理
    const { code } = transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    })
    return code
  }
}

module.exports = parser;