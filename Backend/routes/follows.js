const express = require('express');
const router = express.Router();
const followService = require('../services/followService');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:targetId', authMiddleware, followService.followUser);
router.delete('/:targetId', authMiddleware, followService.unfollowUser);
router.get('/:userId/followers', followService.getFollowers);
router.get('/:userId/following', followService.getFollowing);

router.get('/check/:userId', authMiddleware, followService.checkFollowing);

module.exports = router;
