<template>
  <el-dialog title="添加好友" v-model="visible" center :close-on-click-modal="false">
    <div class="add-friends-content">
      <el-input v-model="keywords" @keyup.enter="handleSearchUsers" placeholder="请输入搜索关键词"></el-input>
      <div class="no-data" v-if="userList.length === 0">暂无用户</div>
      <ul class="user-list" v-else>
        <li v-for="user in userList" :key="user.id" class="user-item">
          <div class="user-item-info">
            <el-avatar :src="user.avatar" :size="28" shape="circle"></el-avatar>
            <span>{{ user.username }}</span>
          </div>
          <div class="user-item-tool">
            <el-button type="primary" @click="handleAddFriend(user.id)">添加</el-button>
          </div>
        </li>
      </ul>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { searchUsers, addFriend } from '@/api/api'
const visible = defineModel()
let keywords = ref('')
let userList = ref([])
const handleSearchUsers = async () => {
  try {
    const { data } = await searchUsers({ keywords: keywords.value })
    userList.value = data
  } catch (error) {
    console.error('搜索用户失败:', error)
  }
}
const handleAddFriend = async (id) => {
  try {
    await addFriend({ friendId: id })
    ElMessage.success('好友请求已发送')
    visible.value = false
  } catch (error) {
    const { response: { data } } = error
    ElMessage.error(data.message)
  }
}
</script>
<style lang="less" scoped>
.add-friends-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.no-data {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-list {
  flex: 1;
  box-sizing: border-box;
  padding: 20px 0;

  .user-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  }

  .user-item-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>
