const { Notification } = require('../models');

exports.listNotifications = async (req, res, next) => {
    try {
        const { limit = 50, skip = 0, unreadOnly } = req.query;
        const filter = { user: req.user._id };
        if (unreadOnly === 'true') filter.isRead = false;

        const notifications = await Notification.find(filter).populate('actor', 'username displayName avatarUrl').sort({ createdAt: -1 }).limit(parseInt(limit)).skip(parseInt(skip));
        const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
        res.json({ notifications, unreadCount });
    } catch (err) {
        next(err);
    }
};

exports.markRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ error: 'Notification not found' });
        if (notification.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });
        notification.isRead = true; await notification.save();
        res.json({ notification });
    } catch (err) { next(err); }
};

exports.markAllRead = async (req, res, next) => {
    try {
        await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
        res.json({ message: 'All notifications marked as read' });
    } catch (err) { next(err); }
};

exports.createNotification = async (req, res, next) => {
    try {
        const { userId, type, payload } = req.body;
        if (!userId || !type) return res.status(400).json({ error: 'userId and type are required' });
        const notification = new Notification({ user: userId, actor: req.user._id, type, payload: payload || {} });
        await notification.save();
        res.status(201).json({ notification });
    } catch (err) { next(err); }
};
