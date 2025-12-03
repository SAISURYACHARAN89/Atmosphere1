const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const verificationService = require('../services/verificationService');

router.post('/documents', authMiddleware, verificationService.uploadDocument);
router.get('/documents', authMiddleware, verificationService.listUserDocuments);
router.get('/status', authMiddleware, verificationService.getStatus);
router.post('/submit', authMiddleware, verificationService.submitVerification);

module.exports = router;
