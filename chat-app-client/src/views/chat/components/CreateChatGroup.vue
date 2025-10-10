<template>
  <el-dialog v-model="visible" class="create-chat-group-dialog" center>
    <el-row>
      <el-col :span="12">
        <el-tree :data="friendList" :props="defaultProps" show-checkbox></el-tree>
      </el-col>
      <el-col :span="12"></el-col>
    </el-row>
  </el-dialog>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { getFriendList } from '@/api/api'
const visible = defineModel()
let friendList = ref([])
onMounted(() => {
  getFriends()
})
const getFriends = async () => {
  try {
    const { data } = await getFriendList()
    friendList.value = data
  } catch (error) {
    console.error('获取好友列表失败:', error)
  }
}
const defaultProps = {
  
}
</script>
