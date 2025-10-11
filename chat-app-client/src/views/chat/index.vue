<template>
  <div class="chat-container">
    <ul class="side-menu">
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
    <div class="main-container">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { menuRoutes } from '@/router';
import { getCurrentUser } from '@/api/api';
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
}
.main-container {
  flex: 1;
  height: 100%;
}
</style>
