const express = require('express');
const router = express.Router();
const { Post, Comment, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/posts - Create new post (requires auth)
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const { content, media, tags, visibility } = req.body;

        const post = new Post({
            author: req.user._id,
            content,
            media: media || [],
            tags: tags || [],
            visibility: visibility || 'public',
        });

        await post.save();
        await post.populate('author', 'username displayName avatarUrl');

        res.status(201).json({ post });
    } catch (err) {
        next(err);
    }
});

// GET /api/posts - Get posts feed
router.get('/', async (req, res, next) => {
    try {
        const { limit = 20, skip = 0, userId, tag } = req.query;

        const filter = { visibility: 'public' };
        if (userId) filter.author = userId;
        if (tag) filter.tags = tag;

        const posts = await Post.find(filter)
            .populate('author', 'username displayName avatarUrl verified')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        res.json({ posts, count: posts.length });
    } catch (err) {
        next(err);
    }
});

// GET /api/posts/:id - Get single post
router.get('/:id', async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username displayName avatarUrl verified');

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({ post });
    } catch (err) {
        next(err);
    }
});

// PUT /api/posts/:id - Update post (requires auth, owner only)
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const updates = {};
        ['content', 'media', 'tags', 'visibility'].forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        Object.assign(post, updates);
        await post.save();
        await post.populate('author', 'username displayName avatarUrl');

        res.json({ post });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/posts/:id - Delete post (requires auth, owner only)
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        next(err);
    }
});

// POST /api/posts/:id/like - Like a post (requires auth)
router.post('/:id/like', authMiddleware, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Increment likes count (in a real app, track individual likes in a separate collection)
        post.likesCount += 1;
        await post.save();

        res.json({ likesCount: post.likesCount });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/posts/:id/like - Unlike a post (requires auth)
router.delete('/:id/like', authMiddleware, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        post.likesCount = Math.max(0, post.likesCount - 1);
        await post.save();

        res.json({ likesCount: post.likesCount });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
