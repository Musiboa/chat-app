import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { initSocket } from './config/socket.js';
import authRoutes from './routes/authRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 确保 uploads 目录存在
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 初始化Express
const app = express();
app.use(cors());
app.use(express.json());

// 注册路由
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

// 静态文件服务
app.use('/uploads', express.static(uploadsDir));

// 创建HTTP服务器
const server = http.createServer(app);

// 初始化Socket.io
initSocket(server);

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
