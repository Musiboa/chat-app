import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 3000
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('token') // 从本地存储中获取token
  if (token) {
    config.headers.Authorization = `Bearer ${token}` // 将token添加到请求头
  } // 如果有token，则将其添加到请求头中
  return config
}, error => {
  return Promise.reject(error)
})

export default request