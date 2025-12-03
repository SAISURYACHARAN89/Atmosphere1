const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');
const authMiddleware = require('../middleware/authMiddleware');

const adminOnly = (req, res, next) => {
    if (!req.user || !req.user.roles || !req.user.roles.includes('admin')) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

router.get('/verification/pending', authMiddleware, adminOnly, adminService.getPendingVerifications);
router.get('/verification/documents/:userId', authMiddleware, adminOnly, adminService.getUserDocuments);
router.put('/verification/:id/approve', authMiddleware, adminOnly, adminService.approveVerification);
router.put('/verification/:id/reject', authMiddleware, adminOnly, adminService.rejectVerification);
router.get('/audit-logs', authMiddleware, adminOnly, adminService.getAuditLogs);
router.get('/users', authMiddleware, adminOnly, adminService.getUsers);

module.exports = router;
