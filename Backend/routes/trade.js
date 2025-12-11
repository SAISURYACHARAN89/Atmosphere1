const express = require('express');
const router = express.Router();
const tradeService = require('../services/tradeService');
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuth');

router.get('/markets', optionalAuth, tradeService.getMarkets);
router.get('/portfolio', authMiddleware, tradeService.getMyPortfolio);
router.post('/order', authMiddleware, tradeService.placeOrder);

module.exports = router;
