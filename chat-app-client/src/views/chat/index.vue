<template>
  <div class="chat-container">
    <div class="side-menu">
      <ul class="menu-list">
        <el-popover :visible="showUserInfo" placement="right" width="300">
          <div class="user-info-popover">
            <div class="popover-header">
              <el-avatar shape="square" :size="50" :src="userInfo.avatar"></el-avatar>
              <div class="header-desc">
                <h2>{{ userInfo.username }}</h2>
                <p>{{ userInfo.status === 'online' ? '在线' : '离线' }}</p>
              </div>
            </div>
            <div class="popover-main"></div>
            <div class="popover-footer">
              <el-button @click="showUpdateUserInfo = true">编辑资料</el-button>
              <el-button type="primary" @click="creatChatWithMyself">发消息</el-button>
            </div>
          </div>
          <template #reference>
            <li class="menu-item avatar-item" @click="showUserInfo = !showUserInfo">
              <el-avatar shape="square" :size="40" :src="userInfo.avatar"></el-avatar>
              <i class="status-icon" v-if="userInfo.status === 'online'"></i>
            </li>
          </template>
        </el-popover>
        <li v-for="route in menuRoutes" :key="route.name" class="menu-item" @click="navigateTo(route.name)">
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
    <update-user-info
      v-model="showUpdateUserInfo"
      :user-info="userInfo"
      @update="handleUpdateUserInfo"
      @close="showUserInfo = false"
    />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { menuRoutes } from '@/router';
import { getCurrentUser, reqLogout, createConversation } from '@/api/api';
import SocketService from '@/utils/socket';
import UpdateUserInfo from '@/views/chat/components/UpdateUserInfo.vue';
const $router = useRouter();
const navigateTo = (name) => {
  $router.push({ name, params: { conversationId: null } });
};
let userInfo = ref({});
let showUpdateUserInfo = ref(false);
let showUserInfo = ref(false);
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
    SocketService.disconnect();
    $router.push({ name: 'login' });
  } catch (error) {
    console.error('退出登录失败:', error);
  }
};
const creatChatWithMyself = async () => {
  try {
    const { data: { conversation } } = await createConversation({});
    showUserInfo.value = false;
    $router.push({ name: 'conversations', params: { conversationId: conversation.id } });
  } catch (error) {
    console.log(error);
  }
};
const handleUpdateUserInfo = () => {
  showUserInfo.value = false;
  getUserInfo();
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
  background-color: rgba(203, 203, 203, 0.35);
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
      background-color: rgba(195, 195, 196, 0.2);
    }
  }
  .avatar-item { 
    position: relative;
    .status-icon {
      position: absolute;
      bottom: 5px;
      right: 10px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #26e78b;
    }
  }
  .action-list {
    .action-item {
      display: flex;
      justify-content: center;
    }
  }
}
.user-info-popover { 
  display: flex;
  flex-direction: column;
  gap: 20px;
  .popover-header {
    display: flex;
    align-items: center;
    gap: 10px;
    .header-desc {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      h2 {
        font-size: 16px;
        font-weight: 500;
        color: #000;
      }
    }
  }
  .popover-footer {
    text-align: center;
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
