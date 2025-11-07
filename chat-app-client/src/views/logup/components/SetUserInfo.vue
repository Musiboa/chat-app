<template>
  <el-dialog title="设置用户信息" v-model="visible" center>
    <el-form :model="userInfo" class="login-form">
      <el-form-item prop="username">
        <el-input
          v-model="userInfo.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="avatar">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          name="image"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="setUserInfo">确认</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { reqSetUserInfo } from '@/api/api.js'
const props = defineProps({
  userId: Number
})
const $router = useRouter()
const uploadUrl = 'http://localhost:3000/api/upload/image'
let visible = defineModel()
let userInfo = ref({
  username: '',
  avatar: ''
})
const handleAvatarSuccess = res => {
  userInfo.value.avatar = res.url
}
const setUserInfo = async () => {
  try {
    await reqSetUserInfo({ userId: props.userId, ...userInfo.value })
    visible.value = false
    $router.push({ name: 'login' })
  } catch (error) {
    console.log(error)
  }
}
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
