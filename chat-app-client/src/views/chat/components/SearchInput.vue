<template>
  <div class="search-input-container">
    <el-input
      v-model="keywords"
      placeholder="搜索"
      prefix-icon="Search"
    ></el-input>
    <el-dropdown trigger="click">
      <el-icon :size="24">
        <Plus />
      </el-icon>
      <template #dropdown placement="bottom-end">
        <el-dropdown-menu>
          <el-dropdown-item @click="showCreateChatGroup = true"
            >创建群聊</el-dropdown-item
          >
          <el-dropdown-item @click="showAddFriends = true"
            >添加好友</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <add-friends
      v-model="showAddFriends"
      class="add-friends-dialog"
    ></add-friends>
    <create-chat-group
      v-model="showCreateChatGroup"
      class="create-chat-group-dialog"
    ></create-chat-group>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import AddFriends from './AddFriends.vue'
import CreateChatGroup from './CreateChatGroup.vue'
let keywords = ref('')
let showAddFriends = ref(false)
let showCreateChatGroup = ref(false)
</script>
<style lang="less" scoped>
.search-input-container {
  box-sizing: border-box;
  padding: 10px 20px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
}

:deep(.add-friends-dialog),
:deep(.create-chat-group-dialog) {
  height: 70vh;
  display: flex;
  flex-direction: column;

  .el-dialog__body {
    flex: 1;
  }
}
</style>
