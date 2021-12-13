export default {
  template: `
  <div>
    <h2>{{message}}<h2>
    <h2>{{name}}<h2>
  </div>
  `,
  data() {
    return {
      message: '你好啊',
      name: '报错'
    }
  }
}