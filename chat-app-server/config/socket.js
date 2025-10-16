import { Server } from 'socket.io';
import pool from './db.js';

let io;
const activeUsers = new Map();

// 初始化Socket.io
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  // 处理连接
  io.on('connection', (socket) => {
    console.log('新客户端连接:', socket.id)

    // 用户登录Socket
    socket.on('user_login', userId => {
      console.log('用户登录:', userId)
      activeUsers.set(userId, socket.id)
      socket.userId = userId

      // 广播用户上线
      socket.broadcast.emit('user_status_change', {
        userId,
        status: 'online'
      })
    })

    // 发送消息
    socket.on('send_message', async data => {
      console.log('接收到消息:', data)
      const { conversationId, content } = data
      const senderId = socket.userId

      console.log('发送者ID:', senderId)
      if (!senderId) return

      try {
        // 保存消息到数据库
        const [result] = await pool.query(
          'INSERT INTO messages (conversation_id, sender_id, content, message_type) VALUES (?, ?, ?, ?)',
          [conversationId, senderId, content, 'text'] // 假设消息类型为text
        )

        const message = {
          id: result.insertId,
          conversation_id: conversationId,
          sender_id: senderId,
          content,
          message_type: 'text',
          is_read: false,
          created_at: new Date()
        }

        // 获取会话中的所有成员（除了发送者）
        const [members] = await pool.query(
          'SELECT user_id FROM conversation_members WHERE conversation_id = ? AND user_id != ?',
          [conversationId, senderId]
        )

        // 发送给会话中的其他成员
        members.forEach(member => {
          const memberSocketId = activeUsers.get(member.user_id)
          if (memberSocketId) {
            io.to(memberSocketId).emit('receive_message', message)
          }
        })

        // 确认发送给发送者
        socket.emit('message_sent', message)
      } catch (error) {
        console.error('保存消息错误:', error)
        socket.emit('message_error', { message: '发送消息失败' })
      }
    })

    // 断开连接
    socket.on('disconnect', async () => {
      const userId = socket.userId
      if (userId) {
        activeUsers.delete(userId)

        // 更新用户状态为离线
        try {
          await pool.query('UPDATE users SET status = "offline" WHERE id = ?', [
            userId
          ])

          // 广播用户下线
          socket.broadcast.emit('user_status_change', {
            userId,
            status: 'offline'
          })
        } catch (error) {
          console.error('更新用户状态错误:', error)
        }
      }
    })
  });

  return io;
};

export const getIo = () => io;
export { initSocket };
