<template>
  <div>
    <h2>{{message}}<h2>
    <h2>{{name}}<h2>
    <Cpn/>
  </div>
</template>

<script>
import Cpn from './Cpn.vue'
export default {
  name:'App',
  components:{
    Cpn
  },
  data() {
    return {
      message: '你好啊',
      name: '报错'
    }
  }
}
</script>

<style scoped>

</style>>

