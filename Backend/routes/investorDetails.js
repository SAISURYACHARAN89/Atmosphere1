const express = require('express');
const router = express.Router();
const investorService = require('../services/investorService');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, investorService.createInvestor);
router.get('/:userId', investorService.getInvestorByUser);
router.put('/:id', authMiddleware, investorService.updateInvestor);
router.get('/', investorService.listInvestors);

module.exports = router;
