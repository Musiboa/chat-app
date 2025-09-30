import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// 用户注册
export const register = async (req, res) => {
  try {
    const { username, phone, password } = req.body;
    
    // 检查用户是否已存在
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR phone = ?',
      [username, phone]
    );
    
    if (users.length > 0) {
      return res.status(400).json({ message: '用户名或手机号已被使用' });
    }
    
    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建新用户
    const [result] = await pool.query(
      'INSERT INTO users (username, phone, password) VALUES (?, ?, ?)',
      [username, phone, hashedPassword]
    );
    
    res.status(201).json({ message: '注册成功', userId: result.insertId });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 用户登录
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }
    
    const user = users[0];
    
    // 验证密码
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: '用户名或密码错误' });
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
