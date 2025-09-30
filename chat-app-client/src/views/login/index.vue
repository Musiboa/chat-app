<template>
  <div class="container">
    <div class="form-container">
      <h1 class="form-title">登录</h1>
      <el-form :model="userInfo" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="userInfo.username" placeholder="请输入用户名" prefix-icon="User" clearable></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="userInfo.password" type="password" show-password placeholder="请输入密码" prefix-icon="Lock"
            clearable></el-input>
        </el-form-item>
        <el-form-item prop="phone" v-show="isLogup">
          <el-input v-model="userInfo.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="confirm-btn" @click="isLogup ? logup() : login()">{{ isLogup ? '注册' : '登录' }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import axios from 'axios';
import { ref } from 'vue';

let isLogup = ref(false);
const userInfo = ref({
  username: '',
  password: '',
  phone: ''
})
const logup = () => {
  axios.post('http://localhost:3000/api/auth/register', {
    username: 'admin',
    phone: '13800000000',
    password: '123456'
  }).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
}
const login = () => {
  axios.post('http://localhost:3000/api/auth/login', userInfo.value).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
}
</script>
<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to top right, rgb(147 197 253 / .5) 0%,#fff 20%,#fff 80%, rgb(147 197 253 / .5) 100%);
  .form-container { 
    box-sizing: border-box;
    width: 400px;
    height: 50vh;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);;
    border-radius: 2vh;
    padding: 20px;
    background-color: #fff;
  }
  .form-title {
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 20px;
  }
  .login-form { 
    width: 100%;
    height: 100%;
    align-items: center;
    .confirm-btn {
      width: 100%;
    }
  }
}
</style>
