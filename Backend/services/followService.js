const { Follow, User } = require('../models');

exports.followUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (userId === req.user._id.toString()) return res.status(400).json({ error: 'Cannot follow yourself' });

        const targetUser = await User.findById(userId);
        if (!targetUser) return res.status(404).json({ error: 'User not found' });

        const existing = await Follow.findOne({ follower: req.user._id, following: userId });
        if (existing) return res.status(409).json({ error: 'Already following this user' });

        const follow = new Follow({ follower: req.user._id, following: userId });
        await follow.save();
        res.status(201).json({ message: 'Successfully followed user', follow });
    } catch (err) {
        next(err);
    }
};

exports.unfollowUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const follow = await Follow.findOneAndDelete({ follower: req.user._id, following: userId });
        if (!follow) return res.status(404).json({ error: 'Not following this user' });
        res.json({ message: 'Successfully unfollowed user' });
    } catch (err) {
        next(err);
    }
};

exports.getFollowers = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { limit = 20, skip = 0 } = req.query;
        const follows = await Follow.find({ following: userId }).populate('follower', 'username displayName avatarUrl verified').sort({ createdAt: -1 }).limit(parseInt(limit)).skip(parseInt(skip));
        const followers = follows.map(f => f.follower);
        res.json({ followers, count: followers.length });
    } catch (err) {
        next(err);
    }
};

exports.getFollowing = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { limit = 20, skip = 0 } = req.query;
        const follows = await Follow.find({ follower: userId }).populate('following', 'username displayName avatarUrl verified').sort({ createdAt: -1 }).limit(parseInt(limit)).skip(parseInt(skip));
        const following = follows.map(f => f.following);
        res.json({ following, count: following.length });
    } catch (err) {
        next(err);
    }
};

exports.checkFollowing = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const follow = await Follow.findOne({ follower: req.user._id, following: userId });
        res.json({ isFollowing: !!follow });
    } catch (err) {
        next(err);
    }
};
