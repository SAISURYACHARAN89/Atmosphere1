const express = require('express');
const router = express.Router();
const { User, Post } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/users/:identifier - Get user by ID or username
router.get('/:identifier', async (req, res, next) => {
    try {
        const { identifier } = req.params;

        // Try to find by ID first, then by username
        let user = await User.findById(identifier).select('-passwordHash');
        if (!user) {
            user = await User.findOne({ username: identifier }).select('-passwordHash');
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (err) {
        next(err);
    }
});

// PUT /api/users/:id - Update user profile (requires auth)
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;

        // Users can only update their own profile
        if (req.user._id.toString() !== id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const updates = {};
        const allowedFields = ['displayName', 'bio', 'avatarUrl', 'links'];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (err) {
        next(err);
    }
});

// GET /api/users/:id/posts - Get user's posts
router.get('/:id/posts', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { limit = 20, skip = 0 } = req.query;

        const posts = await Post.find({ author: id })
            .populate('author', 'username displayName avatarUrl')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        res.json({ posts });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
