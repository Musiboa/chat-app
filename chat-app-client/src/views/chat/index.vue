<template>
  <div class="chat-container">
    <div class="side-menu">
      <ul class="menu-list">
        <li class="menu-item">
          <el-avatar shape="square" :size="40" :src="userInfo.avatar"></el-avatar>
        </li>
        <li v-for="route in menuRoutes" :key="route.name" class="menu-item" @click="navigateTo(route.path)">
          <el-icon :size="24">
            <component :is="route.meta.icon"></component>
          </el-icon>
          <span>{{ route.meta.title }}</span>
        </li>
      </ul>
      <ul class="action-list">
        <el-popover trigger="click" placement="right" popper-class="action-popover" popper-style="padding: 5px;">
          <template #reference>
            <li class="action-item">
              <el-icon :size="24">
                <MoreFilled />
              </el-icon>
            </li>
          </template>
          <ul class="popover-list">
            <li class="popover-item" @click="handleLogout">
              <el-icon :size="16">
                <SwitchButton />
              </el-icon>
              <span>退出登录</span>
            </li>
          </ul>
        </el-popover>
      </ul>
    </div>
    <div class="main-container">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { menuRoutes } from '@/router';
import { getCurrentUser, reqLogout } from '@/api/api';
const $router = useRouter();
const navigateTo = (path) => {
  $router.push(path);
};
let userInfo = ref({});
const getUserInfo = async () => {
  try {
    const { data } = await getCurrentUser();
    userInfo.value = data;
  } catch (error) {
    console.error('获取当前用户信息失败:', error);
  }
};
const handleLogout = async () => {
  try {
    await reqLogout();
    localStorage.removeItem('token');
    $router.push({ name: 'login' });
  } catch (error) {
    console.error('退出登录失败:', error);
  }
};
onMounted(() => {
  getUserInfo();
});
</script>
<style scoped lang="less">
.chat-container {
  display: flex;
  height: 100%;
}
.side-menu {
  height: 100%;
  width: 80px;
  box-sizing: border-box;
  padding: 20px 10px;
  border-right: 1px solid #dfe1e2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .menu-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
    padding: 5px 0;
    margin-bottom: 10px;
    border-radius: 8px;
    &:not(:first-child):hover {
      background-color: #f5f7f9;
    }
  }
  .action-list {
    .action-item {
      display: flex;
      justify-content: center;
    }
  }
}
.action-popover {
  .popover-list {
    .popover-item {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 10px;
      cursor: pointer;
      &:hover {
        background-color: #f5f7f9;
      }
    }
  }
}
.main-container {
  flex: 1;
  height: 100%;
}
</style>
