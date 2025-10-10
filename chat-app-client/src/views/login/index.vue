<template>
  <div class="container">
    <div class="form-container">
      <h1 class="form-title">登录</h1>
      <el-form :model="userInfo" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="userInfo.username" placeholder="请输入用户名" prefix-icon="User"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="userInfo.password" type="password" show-password placeholder="请输入密码" prefix-icon="Lock"></el-input>
        </el-form-item>
        <el-form-item prop="phone" v-show="isLogup">
          <el-input v-model="userInfo.phone" placeholder="请输入手机号" prefix-icon="Iphone" clearable></el-input>
        </el-form-item>
        <el-form-item v-show="!isLogup">
          <el-button type="text" @click="isLogup = true">没有账号？立即注册</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="confirm-btn" @click="isLogup ? logup() : login()">{{ isLogup ? '注册' : '登录'
            }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { reqLogin, reqLogup } from '@/api/api';
import { ElMessage } from 'element-plus';
const $router = useRouter();
let isLogup = ref(false);
const userInfo = ref({
  username: '',
  password: '',
  phone: ''
})
const logup = async () => {
  try {
    await reqLogup(userInfo.value)
    ElMessage.success('注册成功，请登录')
    isLogup.value = false
  } catch (error) {
    console.log(error)
  }
}
const login = async () => {
  try { 
    const { data } = await reqLogin(userInfo.value)
    localStorage.setItem('token', data.token)
    ElMessage.success('登录成功')
    $router.push({ name: 'chat' })
  } catch (error) { 
    console.log(error)
  }
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
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);;
    border-radius: 2vh;
    padding: 50px;
    background-color: #fff;
  }
  .form-title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30%;
    font-size: 24px;
    font-weight: 500;
    text-align: center;
  }
  .login-form {
    flex: 1; 
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .el-input {
      height: 40px;
    }
    .confirm-btn {
      width: 100%;
      height: 40px;
    }
  }
}
</style>
