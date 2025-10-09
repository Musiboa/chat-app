import express from 'express'
import {
  sendFriendRequest,
  handleFriendRequest,
  getFriendList,
  getFriendRequests
} from '../controllers/friendController.js'
import { authenticateToken } from '../utils/auth.js'
const router = express.Router()

router.post('/request', authenticateToken, sendFriendRequest)
router.post('/handle', authenticateToken, handleFriendRequest)
router.get('/list', authenticateToken, getFriendList)
router.get('/get', authenticateToken, getFriendRequests)
export default router
