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