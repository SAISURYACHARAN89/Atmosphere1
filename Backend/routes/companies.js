const express = require('express');
const router = express.Router();

const companyService = require('../services/companyService');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, companyService.createCompany);
router.get('/', companyService.listCompanies);
router.get('/trending/list', companyService.trendingList);
router.get('/:slug', companyService.getCompanyBySlug);
router.put('/:id', authMiddleware, companyService.updateCompany);

module.exports = router;
