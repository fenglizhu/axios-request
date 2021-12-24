<template>
  <div id="app">
    <button @click="search">请求</button>
  </div>
</template>

<script>
import { getUserInfo } from "./request/index";
export default {
  name: 'App',
  methods: {
    search() {
      getUserInfo({
        user:'zhufenli'
      }).then(res=>{
        console.log(res);
      }).catch(error=>{
        console.log(error);

      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
