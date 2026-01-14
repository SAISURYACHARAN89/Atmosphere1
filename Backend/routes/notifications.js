const express = require('express');
const router = express.Router();

const notificationService = require('../services/notificationService');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, notificationService.listNotifications);
router.get('/check-pitch-deck/:startupId', authMiddleware, notificationService.checkPitchDeckStatus);
router.put('/:id/read', authMiddleware, notificationService.markRead);
router.put('/read-all', authMiddleware, notificationService.markAllRead);
router.post('/', authMiddleware, notificationService.createNotification);

module.exports = router;
