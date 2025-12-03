const express = require('express');
const router = express.Router();
const { Comment, Post } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/posts/:postId/comments - Add comment to post (requires auth)
router.post('/:postId/comments', authMiddleware, async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { text, parent } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Comment text is required' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = new Comment({
            post: postId,
            author: req.user._id,
            text,
            parent: parent || null,
        });

        await comment.save();
        await comment.populate('author', 'username displayName avatarUrl');

        // Increment comment count on post
        post.commentsCount += 1;
        await post.save();

        res.status(201).json({ comment });
    } catch (err) {
        next(err);
    }
});

// GET /api/posts/:postId/comments - Get comments for a post
router.get('/:postId/comments', async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { limit = 50, skip = 0 } = req.query;

        const comments = await Comment.find({ post: postId, parent: null })
            .populate('author', 'username displayName avatarUrl')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        res.json({ comments });
    } catch (err) {
        next(err);
    }
});

// GET /api/comments/:id/replies - Get replies to a comment
router.get('/:id/replies', async (req, res, next) => {
    try {
        const { id } = req.params;

        const replies = await Comment.find({ parent: id })
            .populate('author', 'username displayName avatarUrl')
            .sort({ createdAt: 1 });

        res.json({ replies });
    } catch (err) {
        next(err);
    }
});

// PUT /api/comments/:id - Update comment (requires auth, owner only)
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        if (req.body.text) {
            comment.text = req.body.text;
            await comment.save();
        }

        await comment.populate('author', 'username displayName avatarUrl');
        res.json({ comment });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/comments/:id - Delete comment (requires auth, owner only)
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const postId = comment.post;
        await comment.deleteOne();

        // Decrement comment count
        await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } });

        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
