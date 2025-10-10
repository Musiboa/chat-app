import express from 'express'
import {
  sendFriendRequest,
  handleFriendRequest,
  getFriendList,
  getFriendRequests,
  searchUsers
} from '../controllers/friendController.js'
import { authenticateToken } from '../utils/auth.js'
const router = express.Router()

router.post('/add', authenticateToken, sendFriendRequest)
router.post('/handle', authenticateToken, handleFriendRequest)
router.get('/list', authenticateToken, getFriendList)
router.get('/get', authenticateToken, getFriendRequests)
router.get('/search', authenticateToken, searchUsers)
export default router
