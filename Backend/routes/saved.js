const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const savedService = require('../services/savedService');

router.post('/', authMiddleware, savedService.saveItem);
router.get('/', authMiddleware, savedService.getSavedItems);
router.delete('/:id', authMiddleware, savedService.unsaveById);
router.delete('/by-item/:itemType/:itemId', authMiddleware, savedService.unsaveByItem);
router.get('/check/:itemType/:itemId', authMiddleware, savedService.checkSaved);

module.exports = router;
