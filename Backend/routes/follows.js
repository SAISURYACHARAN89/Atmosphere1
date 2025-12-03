const express = require('express');
const router = express.Router();
const { Follow, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/follows/:userId - Follow a user (requires auth)
router.post('/:userId', authMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (userId === req.user._id.toString()) {
            return res.status(400).json({ error: 'Cannot follow yourself' });
        }

        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if already following
        const existing = await Follow.findOne({ follower: req.user._id, following: userId });
        if (existing) {
            return res.status(409).json({ error: 'Already following this user' });
        }

        const follow = new Follow({
            follower: req.user._id,
            following: userId,
        });

        await follow.save();
        res.status(201).json({ message: 'Successfully followed user', follow });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/follows/:userId - Unfollow a user (requires auth)
router.delete('/:userId', authMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.params;

        const follow = await Follow.findOneAndDelete({
            follower: req.user._id,
            following: userId,
        });

        if (!follow) {
            return res.status(404).json({ error: 'Not following this user' });
        }

        res.json({ message: 'Successfully unfollowed user' });
    } catch (err) {
        next(err);
    }
});

// GET /api/follows/:userId/followers - Get user's followers
router.get('/:userId/followers', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { limit = 20, skip = 0 } = req.query;

        const follows = await Follow.find({ following: userId })
            .populate('follower', 'username displayName avatarUrl verified')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const followers = follows.map((f) => f.follower);
        res.json({ followers, count: followers.length });
    } catch (err) {
        next(err);
    }
});

// GET /api/follows/:userId/following - Get users that user is following
router.get('/:userId/following', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { limit = 20, skip = 0 } = req.query;

        const follows = await Follow.find({ follower: userId })
            .populate('following', 'username displayName avatarUrl verified')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const following = follows.map((f) => f.following);
        res.json({ following, count: following.length });
    } catch (err) {
        next(err);
    }
});

// GET /api/follows/check/:userId - Check if current user follows target user (requires auth)
router.get('/check/:userId', authMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.params;

        const follow = await Follow.findOne({
            follower: req.user._id,
            following: userId,
        });

        res.json({ isFollowing: !!follow });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
