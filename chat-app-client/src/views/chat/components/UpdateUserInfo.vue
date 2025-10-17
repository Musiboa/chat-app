<template>
  <el-dialog title="编辑资料" v-model="visible" center @close="$emit('close')">
    <div class="user-info-container">
      <div class="user-avatar">
        <el-upload class="avatar-uploader" :action="uploadUrl" name="image"
          :show-file-list="false" :on-success="handleAvatarSuccess">
          <img v-if="userInfoCopy.avatar" :src="userInfoCopy.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </div>
      <el-form :model="userInfoCopy" class="user-info-form" label-width="80px">
        <el-form-item label="昵称：">
          <el-input v-model="userInfoCopy.username" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="userInfoCopy.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <footer class="user-info-footer">
        <el-button type="primary" @click="handleUpdate">保存</el-button>
        <el-button @click="visible = false">取消</el-button>
      </footer>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, watch } from 'vue';
import { updateUserInfo } from '@/api/api';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const visible = defineModel();
const props = defineProps({
  userInfo: Object
})
const $emit = defineEmits(['update', 'close']);
const uploadUrl = 'http://localhost:3000/api/upload/image';
const userInfoCopy = ref({});
watch(visible, (newVal) => {
  userInfoCopy.value = newVal ? { ...props.userInfo } : {};
})
const handleAvatarSuccess = (res) => {
  userInfoCopy.value.avatar = res.url;
}
const handleUpdate = async () => {
  try {
    const { data } = await updateUserInfo(userInfoCopy.value);
    userStore.setUser(data);
    visible.value = false;
    $emit('update');
  } catch (error) {
    console.log(error);
  }
} 
</script>
<style scoped lang="less">
.user-info-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  .user-avatar {
    align-self: center;
    padding-right: 32px;
  }
  .user-info-footer {
    display: flex;
    justify-content: flex-end;
  }
}
.avatar-uploader .avatar {
  width: 80px;
  height: 80px;
  display: block;
  border-radius: 50%;
}
.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 40px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 24px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  text-align: center;
}
</style>