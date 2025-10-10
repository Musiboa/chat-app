import pool from '../config/db.js'

// 发送好友请求
export const sendFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id // 从认证信息中获取当前用户ID
    const { friendId } = req.body

    // 不能添加自己为好友
    if (userId === friendId) {
      return res.status(400).json({ message: '不能添加自己为好友' })
    }

    // 检查是否已经存在好友关系或请求
    const [existing] = await pool.query(
      'SELECT * FROM friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
      [userId, friendId, friendId, userId]
    )

    if (existing.length > 0) {
      return res.status(400).json({ message: '好友请求已存在或已经是好友' })
    }

    // 插入新的好友请求
    await pool.query(
      'INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, "pending")',
      [userId, friendId]
    )

    res.json({ message: '好友请求已发送' })
  } catch (error) {
    console.error('发送好友请求错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
}

// 处理好友请求（接受或拒绝）
export const handleFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id // 当前用户ID
    const { requestId, action } = req.body // action: 'accepted' 或 'rejected'

    if (!['accepted', 'rejected'].includes(action)) {
      return res.status(400).json({ message: '无效的操作类型' })
    }

    // 验证该请求确实是发送给当前用户的
    const [request] = await pool.query(
      'SELECT * FROM friendships WHERE id = ? AND friend_id = ?',
      [requestId, userId]
    )

    if (request.length === 0) {
      return res.status(404).json({ message: '好友请求不存在或无权限处理' })
    }

    // 更新好友请求状态
    const [result] = await pool.query(
      'UPDATE friendships SET status = ? WHERE id = ?',
      [action, requestId]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '好友请求不存在' })
    }

    res.json({
      message: `好友请求已${action === 'accepted' ? '接受' : '拒绝'}`
    })
  } catch (error) {
    console.error('处理好友请求错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
}

// 获取好友列表
export const getFriendList = async (req, res) => {
  try {
    const userId = req.user.id // 从认证信息中获取

    const [friends] = await pool.query(
      `
      SELECT u.id, u.username, u.phone 
      FROM users u
      JOIN friendships f ON (u.id = f.user_id OR u.id = f.friend_id)
      WHERE (f.user_id = ? OR f.friend_id = ?) 
      AND f.status = 'accepted'
      AND u.id != ?
    `,
      [userId, userId, userId]
    )

    res.json(friends)
  } catch (error) {
    console.error('获取好友列表错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
}

// 获取好友请求列表
export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id // 从认证信息中获取

    const [requests] = await pool.query(
      `
      SELECT f.id as requestId, u.id as userId, u.username, f.created_at 
      FROM users u
      JOIN friendships f ON u.id = f.user_id
      WHERE f.friend_id = ? AND f.status = 'pending'
    `,
      [userId]
    )

    res.json(requests)
  } catch (error) {
    console.error('获取好友请求列表错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
}

// 搜索用户请求
export const searchUsers = async (req, res) => {
  try {
    const userId = req.user.id // 当前用户ID
    const { keywords } = req.query // 从查询参数获取搜索关键词

    if (!keywords || keywords.trim() === '') {
      return res.status(400).json({ message: '请输入搜索关键词' })
    }

    // 搜索用户（排除自己）
    const [users] = await pool.query(
      `
      SELECT id, username, phone, avatar 
      FROM users 
      WHERE (username LIKE ? OR phone LIKE ?) 
      AND id != ?
      LIMIT 20
      `,
      [`%${keywords}%`, `%${keywords}%`, userId]
    )

    res.json(users)
  } catch (error) {
    console.error('搜索用户错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
}
