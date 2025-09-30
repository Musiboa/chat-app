import express from 'express';
const router = express.Router();
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { authenticateToken } from '../utils/auth.js';

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getCurrentUser);

export default router;
