<template>
  <el-container class="conversation-container">
    <el-aside class="conversation-aside">
      <search-input></search-input>
      <ul class="conversation-list">
        <li v-for="conv in conversationList" :key="conv.id" class="conversation-item">
          <el-avatar shape="circle" :size="50" icon="UserFilled"></el-avatar>
          <span>{{ conv.name }}</span>
        </li>
      </ul>
    </el-aside>
    <el-main></el-main>
  </el-container>
</template>
<script setup>
import { ref } from 'vue'
import SearchInput from '@/views/chat/components/SearchInput.vue';
let conversationList = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' },
])
</script>
<style lang="less" scoped>
.conversation-container {
  width: 100%;
  height: 100%;
  display: flex;
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
</style>
