console.log('index加载了');

import('./decrement')
  .then(()=>{
    console.log('decrement被加载了');
  })