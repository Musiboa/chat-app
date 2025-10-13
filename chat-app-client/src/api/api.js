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
