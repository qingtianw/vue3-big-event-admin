<template>
  <hr />
  <hr />
  <router-view></router-view>
  <hr />
  <hr />
  <hr />

  <div>我是APP</div>
  <test-demo></test-demo>
  <el-button @click="$router.push('/home')">跳首页</el-button>
  <el-button @click="showList">跳列表页</el-button>
  <el-button type="primary">Primary</el-button>
  <el-button type="success">Success</el-button>
  <br />
  <p>{{ userstore.token }}</p>
  <el-button @click="userstore.setToken('dfbfvfhfvfgfhf')"> 登录 </el-button>
  <el-button @click="userstore.removeToken()">退出</el-button>
</template>
<script setup>
// 在vue3中组合式API
// 1、获取路由对象 router useRouter
// const router = useRouter()
// 2、获取路由参数route useRoute
// const route = useRoute()
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
const router = useRouter()
function showList() {
  router.push('/list')
  // console.log(router)
}
const userstore = useUserStore()
</script>

<style scoped></style>
