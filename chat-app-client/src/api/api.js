import request from './request'

export function reqLogin(data) {
  return request({
    method: 'POST',
    url: '/auth/login',
    data
  })
}

export function reqLogout() {
  return request({
    method: 'POST',
    url: '/auth/logout'
  })
}

export function reqLogup(data) {
  return request({
    method: 'POST',
    url: '/auth/register',
    data
  })
}

export function reqSetUserInfo(data) {
  return request({
    method: 'POST',
    url: '/auth/set',
    data
  })
}

// 更新用户信息
export function updateUserInfo(data) {
  return request({
    method: 'POST',
    url: `/auth/update`,
    data
  })
}

// 获取当前用户信息
export function getCurrentUser() {
  return request({
    method: 'GET',
    url: '/auth/user'
  })
}

// 获取好友列表
export function getFriendList() {
  return request({
    method: 'GET',
    url: '/friends/list'
  })
}

// 获取好友请求列表
export function getNewFriendList() {
  return request({
    method: 'GET',
    url: '/friends/newlist'
  })
}

// 添加好友
export function addFriend(data) {
  return request({
    method: 'POST',
    url: '/friends/add',
    data
  })
}

// 处理好友请求
export function handleFriendRequest(data) {
  return request({
    method: 'POST',
    url: '/friends/handle',
    data
  })
}

// 搜索用户
export function searchUsers(params) {
  return request({
    method: 'GET',
    url: '/friends/search',
    params
  })
}

// 搜索好友
export function findFriends(params) {
  return request({
    method: 'GET',
    url: '/friends/find',
    params
  })
}

// 创建会话
export function createConversation(data) {
  return request({
    method: 'POST',
    url: '/chat/create',
    data
  })
}

// 获取会话列表
export function getConversations() {
  return request({
    method: 'GET',
    url: '/chat/list'
  })
}

// 获取会话消息
export function getConversationMessages({ conversationId, ...params }) {
  return request({
    method: 'GET',
    url: `/chat/${conversationId}/messages`,
    params
  })
}

// 发送消息
export function sendMessage(data) {
  return request({
    method: 'POST',
    url: `/chat/${data.conversationId}/messages`,
    data
  })
}