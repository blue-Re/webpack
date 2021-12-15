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