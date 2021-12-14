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