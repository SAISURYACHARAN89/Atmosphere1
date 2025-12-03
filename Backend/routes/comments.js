const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const commentService = require('../services/commentService');

router.post('/:postId/comments', authMiddleware, commentService.createComment);
router.get('/:postId/comments', commentService.listComments);
router.get('/:id/replies', commentService.getReplies);
router.put('/:id', authMiddleware, commentService.updateComment);
router.delete('/:id', authMiddleware, commentService.deleteComment);

module.exports = router;
