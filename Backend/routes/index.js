const express = require('express');
const router = express.Router();

router.use('/health', require('./health'));
router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/follows', require('./follows'));
router.use('/companies', require('./companies'));
router.use('/startup-details', require('./startupDetails'));
router.use('/investor-details', require('./investorDetails'));
router.use('/notifications', require('./notifications'));

module.exports = router;
