<template>
  <el-container class="friends-container">
    <el-aside class="friends-aside">
      <search-input></search-input>
      <el-tree :data="friendList" node-key="id" :props="friendProps">
        <template #default="{ node, data }">
          <div class="friend-tree-node" @click="showFriendDetail(node)">
            <span class="tree-node-info">
              <el-avatar shape="circle" :size="20" :src="data.avatar" v-if="node.level > 1"></el-avatar>
              <span>{{ data.label }}</span>
            </span>
            <div class="tree-node-tool" v-if="node.parent.data.label === '新朋友'">
              <el-button text @click.stop="handleRequest(data, true)">同意</el-button>
              <el-button text type="danger" @click.stop="handleRequest(data, false)">拒绝</el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </el-aside>
    <el-main>
      <div class="friends-main" v-if="currentFriend.userId">
        <div class="major-info">
          <div class="major-info-left">
            <el-avatar :src="currentFriend.avatar" :size="100" shape="circle"></el-avatar>
            <div class="major-info-left-text">
              <h2>{{ currentFriend.username }}</h2>
              <p>ID: {{ currentFriend.userId }}</p>
              <p>状态: {{ currentFriend.status === 'online' ? '在线' : '离线' }}</p>
            </div>
          </div>
        </div>
        <div class="more-info"></div>
        <div class="btn-group">
          <el-button type="primary" @click="createChat">发消息</el-button>
        </div>
      </div>
      <div class="no-data" v-else>暂无数据</div>
    </el-main>
  </el-container>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import SearchInput from '@/views/chat/components/SearchInput.vue';
import { getFriendList, getNewFriendList, handleFriendRequest, createConversation } from '@/api/api';
const $router = useRouter();
const friendProps = {
  label: 'label',
  children: 'list'
};
let friendList = ref([
  {
    label: '新朋友',
    list: []
  },
  {
    label: '我的好友',
    list: []
  }
]);
let currentFriend = ref({});
const getFriends = async () => {
  try {
    const { data: friendData } = await getFriendList();
    const { data: newFriendData } = await getNewFriendList();
    friendData.forEach((item) => {
      item.label = item.username;
    });
    newFriendData.forEach((item) => {
      item.label = item.username;
    });
    friendList.value[0].list = newFriendData;
    friendList.value[1].list = friendData;
  } catch (error) {
    console.error('获取好友列表失败:', error);
  }
};
const showFriendDetail = (node) => {
  if(node.level <= 1) return;
  currentFriend.value = node.data;
};
const handleRequest = async (node, isAgree) => {
  const message = isAgree ? '同意' : '拒绝';
  ElMessageBox.confirm(`你确定要${message}好友请求吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(async () => {
    const params = { requestId: node.requestId, action: isAgree ? 'accepted' : 'rejected' };
    try {
      await handleFriendRequest(params);
      ElMessage.success(`已${message}好友请求`);
      getFriends();
    } catch (error) {
      const { response: { data } } = error;
      ElMessage.error(data.message);
    }
  }).catch(() => {
    console.log('取消好友请求');
  });
};
const createChat = async () => {
  try {
    const params = { name: currentFriend.value.username, memberIds: [currentFriend.value.userId] };
    const { data: { conversation } } = await createConversation(params);
    $router.push({
      name: 'conversations',
      params: {
        conversationId: conversation.id
      }
    });
  } catch (error) {
    const { response: { data } } = error;
    ElMessage.error(data.message);
  }
};
onMounted(() => {
  getFriends();
});
</script>
<style lang="less" scoped>
.friends-container {
  width: 100%;
  height: 100%;
  display: flex;
}

.friends-aside {
  box-sizing: border-box;
  height: 100%;
  padding: 20px 0;
  border-right: 1px solid #dfe1e2;
}

.friend-tree-node {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
}
.tree-node-info,
.tree-node-tool {
  display: flex;
  align-items: center;
  gap: 5px;
  .el-button {
    padding: 0;
    margin: 0;
  }
}

.no-data {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.friends-main {
  height: 100%;
  flex: 1;
  padding: 50px;
  display: flex;
  flex-direction: column;
  .btn-group {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }
}
.major-info {
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}
.major-info-left {
  display: flex;
  align-items: center;
  gap: 20px;
  .major-info-left-text {
    display: flex;
    flex-direction: column;
    gap: 5px;
    h2 {
      font-weight: 500;
    }
  }
}
</style>

