import express from 'express'
import {
  createConversation,
  getConversations,
  addMembersToConversation,
  sendMessage,
  getConversationMessages
} from '../controllers/chatController.js'
import { authenticateToken } from '../utils/auth.js'
const router = express.Router()

router.post('/create', authenticateToken, createConversation)
router.get('/list', authenticateToken, getConversations)
router.post('/members', authenticateToken, addMembersToConversation)
router.post('/:conversationId/messages', authenticateToken, sendMessage)
router.get('/:conversationId/messages', authenticateToken, getConversationMessages)

export default router