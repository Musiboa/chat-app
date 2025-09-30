import jwt from 'jsonwebtoken';

// JWT验证中间件
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: '未授权访问' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ message: '令牌无效' });
    req.user = user;
    next();
  });
};
