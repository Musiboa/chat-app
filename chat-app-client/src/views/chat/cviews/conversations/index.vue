<template>
  <el-container class="conversation-container">
    <el-aside class="conversation-aside">
      <search-input></search-input>
      <ul class="conversation-list">
        <li v-for="conv in conversationList" :key="conv.id" class="conversation-item" @click="switchConversation(conv)">
          <el-avatar shape="circle" :size="50" icon="UserFilled"></el-avatar>
          <span>{{ conv.name }}</span>
        </li>
      </ul>
    </el-aside>
    <el-main>
      <div class="conversation-main" v-if="currentConversation.id">
        <div class="main-header">
          <h1>{{ currentConversation.name }}</h1>
        </div>
        <div class="main-message-container" ref="messageContainer">
          <ul class="message-list">
            <li v-for="msg in messageList" :key="msg.id" class="message-item" :class="msg.sender_id === userStore.user.id ? 'self-message' : 'other-message'">
              <p v-if="msg.sender_id !== userStore.user.id">{{ msg.content }}</p>
              <p v-else>{{ msg.content }}</p>
            </li>
          </ul>
        </div>
        <div class="main-input-box">
          <el-input type="textarea" class="main-input" :rows="8" resize="none" v-model="messageContent" @keyup.enter="handleSendMessage"></el-input>
          <el-button text class="send-btn" @click="handleSendMessage">发送</el-button>
        </div>
      </div>
      <div class="no-data" v-else>
        暂无数据
      </div>
    </el-main>
  </el-container>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getConversations, getConversationMessages, sendMessage } from '@/api/api'
import SearchInput from '@/views/chat/components/SearchInput.vue';
const userStore = useUserStore()
let conversationList = ref([])
let currentConversation = ref({})
let messageContent = ref('')
let messageList = ref([])
const messageContainer = ref(null)
const getConversationList = async () => {
  try {
    const { data } = await getConversations()
    conversationList.value = data
  } catch (error) {
    console.error('获取会话列表失败:', error)
  }
}
const switchConversation = (conv) => {
  currentConversation.value = conv
  getConversationMessageList()
}
const getConversationMessageList = async () => {
  try {
    const { data: { data } } = await getConversationMessages({conversationId:currentConversation.value.id})
    messageList.value = data
  } catch (error) {
    console.error('获取会话消息失败:', error)
  }
}
const handleSendMessage = async () => { 
  try {
    const params = {
      conversationId: currentConversation.value.id,
      content: messageContent.value,
    }
    const { data } = await sendMessage(params)
    messageContent.value = ''
    await getConversationMessageList()
    // 滚动到最底部
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  } catch (error) {
    console.error('发送消息失败:', error)
  }
}
onMounted(() => {
  getConversationList()
})
</script>
<style lang="less" scoped>
.conversation-container {
  width: 100%;
  height: 100%;
  display: flex;
  .el-main {
    padding: 0;
  }
}

.conversation-aside {
  box-sizing: border-box;
  height: 100%;
  padding: 20px 0;
  border-right: 1px solid #dfe1e2;
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

.conversation-main {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  .main-header {
    padding: 30px 20px 10px;
    border-bottom: 1px solid #dfe1e2;
  }
  .main-message-container { 
    padding: 0 20px;
    flex: 1;
    overflow: auto;
    .message-list {
      display: flex; 
      flex-direction: column;
      gap: 10px;
      .message-item { 
        box-sizing: border-box;
        padding: 10px;
        border-radius: 5px;
      }
      .other-message {
        align-self: flex-start;
        background-color: #e4e7eb;
      }
      .self-message {
        align-self: flex-end;
        background-color: #c9e2f0;
      }
    }
  }
}
.no-data {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.main-input-box {
  padding: 20px;
  position: relative;
  .send-btn {
    position: absolute;
    bottom: 25px;
    right: 20px;
    color: #c9cbcc;
    &:hover {
      background-color: transparent;
      color: #9da0a3;
    }
  }
}
</style>
