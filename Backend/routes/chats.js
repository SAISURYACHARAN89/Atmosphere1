const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const chatService = require('../services/chatService');

router.get('/', authMiddleware, chatService.listChats);
router.post('/', authMiddleware, chatService.createOrFindChat);
router.get('/:id', authMiddleware, chatService.getChatDetails);
router.get('/:id/messages', authMiddleware, chatService.getMessages);
router.post('/:id/messages', authMiddleware, chatService.sendMessage);
router.delete('/:id', authMiddleware, chatService.deleteChatForUser);

module.exports = router;
