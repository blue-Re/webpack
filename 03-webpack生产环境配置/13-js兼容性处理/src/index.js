// import '@babel/polyfill'
const add = (x, y) => x + y
console.log(add(1,2));

new Promise((resolve,reject)=>{
  setInterval(()=>{
    console.log('111');
    resolve()
  },1000)
})