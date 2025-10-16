import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// 用户注册
export const register = async (req, res) => {
  try {
    const { username, phone, password } = req.body;
    
    // 检查用户是否已存在
    const [users] = await pool.query(
      'SELECT * FROM users WHERE phone = ?',
      [phone]
    );
    
    if (users.length > 0) {
      return res.status(400).json({ message: '手机号已被使用' });
    }
    
    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建新用户
    const [result] = await pool.query(
      'INSERT INTO users ( phone, password) VALUES (?, ?)',
      [phone, hashedPassword]
    );
    
    res.status(201).json({ message: '注册成功', userId: result.insertId });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 注册后设置用户信息（无需认证）
export const setInitialUserInfo = async (req, res) => {
  try {
    const { userId, username, avatar } = req.body;
    
    // 验证用户是否存在且未设置过用户名
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ? AND (username IS NULL OR username = "")',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ message: '用户不存在或已设置过用户名' });
    }
    
    // 更新用户信息
    await pool.query(
      'UPDATE users SET username = ?, avatar = ? WHERE id = ?',
      [username, avatar || null, userId]
    );
    
    // 返回更新后的用户信息
    const [updatedUsers] = await pool.query(
      'SELECT id, username, phone, avatar, status FROM users WHERE id = ?',
      [userId]
    );
    
    res.json(updatedUsers[0]);
  } catch (error) {
    console.error('设置初始用户信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 用户登录
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // 查找用户
    const [users] = await pool.query(
      'SELECT * FROM users WHERE phone = ?',
      [phone]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ message: '手机号或密码错误' });
    }
    
    const user = users[0];
    
    // 验证密码
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: '手机号或密码错误' });
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
    
    // 更新用户状态为在线
    await pool.query(
      'UPDATE users SET status = "online" WHERE id = ?',
      [user.id]
    );
    
    res.json({ 
      message: '登录成功', 
      token,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        avatar: user.avatar,
        status: 'online'
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 用户退出登录
export const logout = async (req, res) => {
  try {
    // 将用户状态更新为离线
    await pool.query(
      'UPDATE users SET status = "offline" WHERE id = ?',
      [req.user.id]
    );
    
    res.json({ message: '退出登录成功' });
  } catch (error) {
    console.error('退出登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取当前用户信息
export const getCurrentUser = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, phone, avatar, status FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新用户信息
export const updateUser = async (req, res) => {
  try {
    const { username, phone, avatar, password } = req.body;
    
    // 构建动态更新查询
    const updates = [];
    const values = [];
    
    if (username !== undefined) {
      updates.push('username = ?');
      values.push(username);
    }
    
    if (phone !== undefined) {
      // 检查手机号是否已被其他用户使用
      const [existingUsers] = await pool.query(
        'SELECT * FROM users WHERE phone = ? AND id <> ?',
        [phone, req.user.id]
      );
      
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: '手机号已被使用' });
      }
      
      updates.push('phone = ?');
      values.push(phone);
    }
    
    if (avatar !== undefined) {
      updates.push('avatar = ?');
      values.push(avatar);
    }
    
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }
    
    // 如果没有提供任何要更新的字段
    if (updates.length === 0) {
      const [currentUser] = await pool.query(
        'SELECT id, username, phone, avatar, status FROM users WHERE id = ?',
        [req.user.id]
      );
      return res.json(currentUser[0]);
    }
    
    // 更新用户数据
    values.push(req.user.id); // 添加用户ID作为WHERE条件
    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // 返回更新后的用户信息
    const [updatedUsers] = await pool.query(
      'SELECT id, username, phone, avatar, status FROM users WHERE id = ?',
      [req.user.id]
    );  
    
    if (updatedUsers.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json(updatedUsers[0]);
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

