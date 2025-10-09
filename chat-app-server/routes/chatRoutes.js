import express from 'express'
import {
  createConversation,
  getConversations,
  getConversationDetails,
  addMembersToConversation,
  sendMessage,
  getConversationMessages
} from '../controllers/chatController.js'
import { authenticateToken } from '../utils/auth.js'
const router = express.Router()

router.post('/conversations/create', authenticateToken, createConversation)
router.get('/conversations', authenticateToken, getConversations)
router.get('/conversations/detail', authenticateToken, getConversationDetails)
router.post('/conversations/members', authenticateToken, addMembersToConversation)
router.post('/conversations/messages', authenticateToken, sendMessage)
router.get('/conversations/messages', authenticateToken, getConversationMessages)

export default router