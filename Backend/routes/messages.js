const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const messageService = require('../services/messageService');

// Get all messages in a chat
router.get('/:chatId', authMiddleware, messageService.getMessages);

// Send a new message
router.post('/:chatId', authMiddleware, messageService.sendMessage);

module.exports = router;