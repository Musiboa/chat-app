import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.userId = null

    // 回调函数数组
    this.messageCallbacks = []
    this.messageSentCallbacks = []
    this.userStatusCallbacks = []
  }

  // 连接Socket
  connect() {
    if (this.socket && this.isConnected) return
    // 连接到服务器
    this.socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })
    // 监听连接成功事件
    this.socket.on('connect', () => {
      console.log('WebSocket 连接成功:', this.socket.id)
      this.isConnected = true
      // 如果已经有用户ID，自动发送登录通知
      if (this.userId) {
        this.userLogin(this.userId)
      }
    })
    // 监听连接失败事件
    this.socket.on('connect_error', error => {
      console.error('WebSocket 连接错误:', error)
    })
    // 监听断开连接事件
    this.socket.on('disconnect', reason => {
      console.log('WebSocket 断开连接:', reason)
      this.isConnected = false
    })
    // 监听接收到的消息
    this.socket.on('receive_message', message => {
      console.log('收到消息:', message)
      // 调用所有注册的回调函数
      this.messageCallbacks.forEach(callback => callback(message))
    })

    // 监听发送确认
    this.socket.on('message_sent', message => {
      console.log('消息发送成功:', message)
      // 调用所有注册的回调函数
      this.messageSentCallbacks.forEach(callback => callback(message))
    })

    // 监听用户状态变化
    this.socket.on('user_status_change', data => {
      console.log('用户状态变化:', data)
      this.userStatusCallbacks.forEach(callback => callback(data))
    })

    // 监听错误
    this.socket.on('message_error', error => {
      console.error('消息发送错误:', error)
    })
  }

  // 用户登录通知
  userLogin(userId) {
    this.userId = userId
    if (this.isConnected && this.socket) {
      this.socket.emit('user_login', userId)
    }
  }

  // 发送消息
  sendMessage(data) {
    if (this.isConnected && this.socket) {
      this.socket.emit('send_message', data)
    }
  }

  // 注册消息接收回调
  onMessage(callback) {
    this.messageCallbacks.push(callback)
  }

  // 注册消息发送确认回调
  onMessageSent(callback) {
    this.messageSentCallbacks.push(callback)
  }

  // 注册用户状态变化回调
  onUserStatusChange(callback) {
    this.userStatusCallbacks.push(callback)
  }

  // 移除消息接收回调
  offMessage(callback) {
    this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback)
  }

  // 移除消息发送确认回调
  offMessageSent(callback) {
    this.messageSentCallbacks = this.messageSentCallbacks.filter(
      cb => cb !== callback
    )
  }

  // 移除用户状态变化回调
  offUserStatusChange(callback) {
    this.userStatusCallbacks = this.userStatusCallbacks.filter(
      cb => cb !== callback
    )
  }

  // 监听事件
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }
  // 移除监听事件
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  // 断开连接
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.isConnected = false
      this.userId = null

      // 清空所有回调函数
      this.messageCallbacks = []
      this.messageSentCallbacks = []
      this.userStatusCallbacks = []
    }
  }

  // 检查连接状态
  get connected() {
    return this.isConnected && this.socket?.connected
  }
}

export default new SocketService()