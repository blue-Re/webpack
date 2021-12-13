console.log('index加载了');

import '@/index.css'

import('./decrement')
  .then(()=>{
    console.log('decrement被加载了');
  })