<template>
  <div class="container">
    <div class="form-container">
      <h1 class="form-title">注册</h1>
      <el-form :model="userInfo" class="logup-form">
        <el-form-item prop="phone">
          <el-input v-model="userInfo.phone" placeholder="请输入手机号" prefix-icon="Iphone" clearable></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="userInfo.password" type="password" show-password placeholder="请输入密码"
            prefix-icon="Lock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="confirm-btn" @click="logup">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <set-user-info v-model="showSetUserInfo" :user-id="userId"></set-user-info>
  </div>
</template>
<script setup>
import { nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { reqLogup } from '@/api/api';
import { ElMessage } from 'element-plus';
import SetUserInfo from './components/SetUserInfo.vue';
let isLogup = ref(false);
const userInfo = ref({
  password: '',
  phone: ''
})
let showSetUserInfo = ref(false)
let userId = ref(null)
const logup = async () => {
  try {
    const { data } = await reqLogup(userInfo.value)
    userId.value = data.userId
    showSetUserInfo.value = true
    // ElMessage.success('注册成功，请登录')
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
  background: linear-gradient(to top right, rgb(147 197 253 / .5) 0%, #fff 20%, #fff 80%, rgb(147 197 253 / .5) 100%);

  .form-container {
    box-sizing: border-box;
    width: 400px;
    height: 50vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
    ;
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

  .logup-form {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

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
