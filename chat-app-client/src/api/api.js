import request from './request'

export function reqLogin(data) {
  return request({
    method: 'POST',
    url: '/auth/login',
    data
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

// 添加好友
export function addFriend(data) {
  return request({
    method: 'POST',
    url: '/friends/add',
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
