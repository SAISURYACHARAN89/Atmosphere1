const express = require('express');
const router = express.Router();
const searchService = require('../services/searchService');

router.get('/', searchService.searchAll);
router.get('/users', searchService.searchUsers);
router.get('/trending', searchService.getTrending);
router.get('/suggestions', searchService.getSuggestions);

module.exports = router;
