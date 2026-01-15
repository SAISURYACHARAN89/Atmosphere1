const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const analyticsService = require('../services/analyticsService');

/**
 * GET /api/analytics/insights
 * Get views and profile visit insights
 */
router.get('/insights', authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const days = parseInt(req.query.days) || 30;
        const insights = await analyticsService.getInsights(userId, days);
        res.json(insights);
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/analytics/followers
 * Get follower growth analytics
 */
router.get('/followers', authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const days = parseInt(req.query.days) || 30;
        const growth = await analyticsService.getFollowerGrowth(userId, days);
        res.json(growth);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
