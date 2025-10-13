<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" center>
    <el-row>
      <el-col :span="12" class="left-col">
        <el-input v-model="keywords" placeholder="搜索" prefix-icon="Search" @keyup.enter="searchFriends"></el-input>
        <el-tree :data="friendList" :props="defaultProps" show-checkbox @check-change="handleCheckChange"></el-tree>
      </el-col>
      <el-col :span="12" class="right-col">
        <h1>创建群聊</h1>
        <ul class="selected-friend-list">
          <li v-for="item in groupMembers" :key="item.id" class="selected-friend-item">
            <el-avatar :src="item.avatar" shape="circle" :size="30"></el-avatar>
            <div class="friend-item-info">{{ item.username }}  </div>
          </li>
        </ul>
        <div class="selected-footer">
          <el-button type="primary" @click="createGroupChat">创建群聊</el-button>
          <el-button @click="visible = false">取消</el-button>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getFriendList, findFriends, createConversation } from '@/api/api'
const visible = defineModel()
let friendList = ref([])
let groupMembers = ref([])
let keywords = ref('')
onMounted(() => {
  getFriends()
})
/* 
  data: 当前点击的节点数据
  checked: 当前节点的选中状态
  indeterminate: 当前节点的子节点是否有被选中的
*/
const handleCheckChange = (data, checked, indeterminate) => {
  console.log('点击了节点', data, checked, indeterminate)
  if (checked) {
    groupMembers.value.push(data)
  } else {
    groupMembers.value = groupMembers.value.filter(item => item.userId !== data.userId)
  }
}
const getFriends = async () => {
  try {
    const { data } = await getFriendList()
    friendList.value = data
  } catch (error) {
    console.error('获取好友列表失败:', error)
  }
}
const searchFriends = async () => {
  try {
    const { data } = await findFriends({ keywords: keywords.value })
    friendList.value = data
  } catch (error) {
    console.error('搜索好友列表失败:', error)
  }
}
const createGroupChat = async () => {
  try {
    const params = {
      name: '未命名',
      isGroup: true,
      memberIds: groupMembers.value.map(item => item.userId)
    }
    const { data } = await createConversation(params)
    ElMessage.success(`群聊${data.conversation.name}创建成功`)
    visible.value = false
  } catch (error) {
    console.error('创建群聊失败:', error)
  }
}
const defaultProps = {
  label: 'username',
  children: 'list',
}
</script>
<style scoped lang="less">
.el-row{
  height: 100%;
}
.left-col {
  padding-right: 20px;
  height: 100%;
  border-right: 1px solid #dfe1e2;
}
.right-col {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  height: 100%;
  h1 {
    font-size: 18px;
  }
  .selected-friend-list {
    padding: 20px 0;
    height: 100%;
    overflow: auto;
    .selected-friend-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  }
  .selected-footer {
    padding-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
