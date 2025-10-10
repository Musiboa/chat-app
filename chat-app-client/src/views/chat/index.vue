<template>
  <div class="chat-container">
    <el-container>
      <el-header class="chat-header">
        <div class="header-left">
          <el-avatar shape="square" :size="36" icon="UserFilled"></el-avatar>
          <h2>当前用户</h2>
        </div>
        <div class="header-center">
          <el-input placeholder="搜索" prefix-icon="Search"></el-input>
        </div>
        <ul class="header-right">
          <li><el-icon :size="24">
              <Bell />
            </el-icon></li>
          <li><el-icon :size="24">
              <Setting />
            </el-icon></li>
          <li>
            <el-dropdown trigger="click">
              <el-icon :size="24">
                <Plus />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="showCreateChatGroup = true">创建群聊</el-dropdown-item>
                  <el-dropdown-item @click="showAddFriends = true">添加好友</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </li>
        </ul>
      </el-header>
      <el-container>
        <el-aside class="chat-aside">
          <ul class="conversation-list">
            <li v-for="conv in conversationList" :key="conv.id" class="conversation-item">
              <el-avatar shape="circle" :size="50" icon="UserFilled"></el-avatar>
              <span>{{ conv.name }}</span>
            </li>
          </ul>
        </el-aside>
        <el-main class="chat-main">主题</el-main>
      </el-container>
    </el-container>
    <add-friends v-model="showAddFriends"></add-friends>
    <create-chat-group v-model="showCreateChatGroup"></create-chat-group>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { getCurrentUser, getFriendList } from '@/api/api.js';
import AddFriends from './components/AddFriends.vue';
import CreateChatGroup from './components/CreateChatGroup.vue';
let showAddFriends = ref(false)
let showCreateChatGroup = ref(false)
onMounted(() => {
  getFriendList().then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
})
let friendLists = ref([])
let conversationList = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' },
])
friendLists.value = [
  { id: 1, name: '张三', status: 'online' },
  { id: 2, name: '李四', status: 'offline' },
  { id: 3, name: '王五', status: 'online' },
  { id: 4, name: '赵六', status: 'offline' },
]
</script>
<style scoped lang="less">
.chat-container {
  width: 100%;
  height: 100%;
}
.chat-header {
  box-sizing: border-box;
  border-bottom: 1px solid #e1eaf1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-left,
  .header-right {
    display: flex;
    gap: 20px;
  }
  .header-left {
    width: 300px;
  }
  .header-center {
    flex: 1;
    .el-input {
      width: 20%;
    }
  }
}
.chat-aside {
  box-sizing: border-box;
  border-right: 1px solid #e1eaf1;
}
.conversation-list {
  .conversation-item {
    box-sizing: border-box;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    &.active {
      background-color: #eaeff2;
    }
    &:hover {
      background-color: #f5f7f9;
      cursor: pointer;
    }
  }
}
.chat-main {
  height: calc(100vh - 60px);
  background-color: #ecf0f3;
}
:deep(.add-friends-dialog) {
  height: 70vh;
  display: flex;
  flex-direction: column;
  .el-dialog__body {
    flex: 1;
  }
}
:deep(.create-chat-group-dialog) {
  height: 70vh;
}
</style>
