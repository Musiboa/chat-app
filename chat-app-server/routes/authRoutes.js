import express from 'express';
const router = express.Router();
import { register, login, getCurrentUser, updateUser } from '../controllers/authController.js';
import { authenticateToken } from '../utils/auth.js';

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticateToken, getCurrentUser);
router.post('/user', authenticateToken, updateUser);

export default router;
