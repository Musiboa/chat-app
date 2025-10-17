import pool from '../config/db.js'

// 创建会话
export const createConversation = async (req, res) => {
  const connection = await pool.getConnection()
  try {
    const userId = req.user.id
    const { name, isGroup = false, memberIds = [] } = req.body

    // 如果是私人聊天（非群聊），检查是否已存在对话
    if (!isGroup && memberIds.length <= 1) {
      let otherUserId;
      
      if (memberIds.length === 1) {
        otherUserId = memberIds[0];
      } else {
        // 自己与自己对话的情况
        otherUserId = userId;
      }

      // 检查是否已存在对话（包括自己与自己的对话）
      const [existingConversations] = await connection.query(`
        SELECT c.id 
        FROM conversations c
        JOIN conversation_members cm1 ON c.id = cm1.conversation_id
        JOIN conversation_members cm2 ON c.id = cm2.conversation_id
        WHERE c.is_group = 0
          AND cm1.user_id = ?
          AND cm2.user_id = ?
          AND NOT EXISTS (
            SELECT 1 FROM conversation_members cm3 
            WHERE cm3.conversation_id = c.id 
              AND cm3.user_id NOT IN (?, ?)
          )
      `, [userId, otherUserId, userId, otherUserId])

      // 如果已存在对话，返回该对话
      if (existingConversations.length > 0) {
        const [conversation] = await pool.query(
          `
          SELECT c.*, 
                 GROUP_CONCAT(u.username) as members
          FROM conversations c
          LEFT JOIN conversation_members cm ON c.id = cm.conversation_id
          LEFT JOIN users u ON cm.user_id = u.id
          WHERE c.id = ?
          GROUP BY c.id
        `,
          [existingConversations[0].id]
        )

        return res.status(200).json({
          message: '对话已存在',
          conversation: conversation[0]
        })
      }
    }

    // 开始事务
    await connection.beginTransaction()

    // 创建会话
    const [conversationResult] = await connection.query(
      'INSERT INTO conversations (name, is_group) VALUES (?, ?)',
      [isGroup ? name : null, isGroup]
    )

    const conversationId = conversationResult.insertId

    // 添加会话成员
    let members;
    if (isGroup) {
      members = [userId, ...memberIds]
    } else if (memberIds.length === 0) {
      // 处理自己与自己对话的情况，当memberIds为空时
      members = [userId]
    } else {
      members = [userId, ...memberIds]
    }
    
    const memberValues = members.map(id => [conversationId, id])

    if (memberValues.length > 0) {
      await connection.query(
        'INSERT INTO conversation_members (conversation_id, user_id) VALUES ?',
        [memberValues]
      )
    }

    // 提交事务
    await connection.commit()

    // 获取创建的会话详情
    const [conversation] = await pool.query(
      `
      SELECT c.*, 
             GROUP_CONCAT(u.username) as members
      FROM conversations c
      LEFT JOIN conversation_members cm ON c.id = cm.conversation_id
      LEFT JOIN users u ON cm.user_id = u.id
      WHERE c.id = ?
      GROUP BY c.id
    `,
      [conversationId]
    )

    res.status(201).json({
      message: '会话创建成功',
      conversation: conversation[0]
    })
  } catch (error) {
    // 回滚事务
    await connection.rollback()
    console.error('创建会话错误:', error)
    res.status(500).json({ message: '服务器错误' })
  } finally {
    connection.release()
  }
}

// 获取会话列表
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id

    const [conversations] = await pool.query(
      `
      SELECT c.id, c.name, c.is_group, c.avatar, c.created_at, c.updated_at,
             cm.user_id,
             u.username,
             u.avatar,
             COUNT(cm2.user_id) as member_count
      FROM conversations c
      JOIN conversation_members cm ON c.id = cm.conversation_id
      JOIN users u ON cm.user_id = u.id
      JOIN conversation_members cm2 ON c.id = cm2.conversation_id
      WHERE c.id IN (
        SELECT conversation_id 
        FROM conversation_members 
        WHERE user_id = ?
      )
      GROUP BY c.id, cm.user_id, u.username, u.avatar
      ORDER BY c.updated_at DESC
    `,
      [userId]
    )

    // 对结果进行重组，将同一会话的成员组织成数组
    const conversationMap = new Map()
    
    conversations.forEach(row => {
      if (!conversationMap.has(row.id)) {
        conversationMap.set(row.id, {
          id: row.id,
          name: row.name,
          is_group: row.is_group,
          avatar: row.avatar,
          created_at: row.created_at,
          updated_at: row.updated_at,
          member_count: row.member_count,
          members: []
        })
      }
      
      conversationMap.get(row.id).members.push({
        userId: row.user_id,
        username: row.username,
        avatar: row.avatar
      })
    })

    const result = Array.from(conversationMap.values())

    res.json(result)
  } catch (error) {
    console.error('获取会话列表错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
}

// 添加成员到群聊
export const addMembersToConversation = async (req, res) => {
  try {
    const userId = req.user.id
    const { conversationId, memberIds } = req.body

    // 验证会话是否存在且是群聊
    const [conversation] = await pool.query(
      'SELECT is_group FROM conversations WHERE id = ?',
      [conversationId]
    )

    if (conversation.length === 0) {
      return res.status(404).json({ message: '会话不存在' })
    }

    if (!conversation[0].is_group) {
      return res.status(400).json({ message: '只能向群聊添加成员' })
    }

    // 验证当前用户是否是会话成员
    const [memberCheck] = await pool.query(
      'SELECT * FROM conversation_members WHERE conversation_id = ? AND user_id = ?',
      [conversationId, userId]
    )

    if (memberCheck.length === 0) {
      return res.status(403).json({ message: '您不是该会话的成员' })
    }

    // 添加新成员
    const memberValues = memberIds.map(id => [conversationId, id])
    if (memberValues.length > 0) {
      await pool.query(
        'INSERT IGNORE INTO conversation_members (conversation_id, user_id) VALUES ?',
        [memberValues]
      )
    }

    res.json({ message: '成员添加成功' })
  } catch (error) {
    console.error('添加成员错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
}

// 发送消息
export const sendMessage = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const senderId = req.user.id;
    const { conversationId, content, messageType = 'text' } = req.body;

    // 验证用户是否是会话成员
    const [memberCheck] = await connection.query(
      'SELECT * FROM conversation_members WHERE conversation_id = ? AND user_id = ?',
      [conversationId, senderId]
    );

    if (memberCheck.length === 0) {
      return res.status(403).json({ message: '您不是该会话的成员' });
    }

    // 插入消息
    const [messageResult] = await connection.query(
      'INSERT INTO messages (conversation_id, sender_id, content, message_type) VALUES (?, ?, ?, ?)',
      [conversationId, senderId, content, messageType]
    );

    // 更新会话的updated_at字段
    await connection.query(
      'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [conversationId]
    );

    // 获取发送的消息详情
    const [messageDetails] = await connection.query(`
      SELECT m.*, u.username as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?
    `, [messageResult.insertId]);

    res.status(201).json({
      message: '消息发送成功',
      data: messageDetails[0]
    });
  } catch (error) {
    console.error('发送消息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  } finally {
    connection.release();
  }
};

// 获取会话消息
export const getConversationMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // 验证用户是否是会话成员
    const [memberCheck] = await pool.query(
      'SELECT * FROM conversation_members WHERE conversation_id = ? AND user_id = ?',
      [conversationId, userId]
    );

    if (memberCheck.length === 0) {
      return res.status(403).json({ message: '您不是该会话的成员' });
    }

    // 获取会话消息，按创建时间倒序排列
    const [messages] = await pool.query(`
      SELECT m.*, u.username as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `, [conversationId, parseInt(limit), parseInt(offset)]);

    // 将消息按时间正序排列（从旧到新）
    const orderedMessages = messages.reverse();

    res.json({
      message: '获取消息成功',
      data: orderedMessages
    });
  } catch (error) {
    console.error('获取会话消息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};
