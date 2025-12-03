const { SavedItem } = require('../models');

exports.saveItem = async (req, res, next) => {
    try {
        const { itemType, itemId } = req.body;
        if (!itemType || !itemId) return res.status(400).json({ error: 'itemType and itemId are required' });
        if (!['Post', 'Company', 'Job'].includes(itemType)) return res.status(400).json({ error: 'Invalid itemType' });

        const existingSaved = await SavedItem.findOne({ user: req.user._id, itemType, itemId });
        if (existingSaved) return res.status(400).json({ error: 'Item already saved' });

        const savedItem = new SavedItem({ user: req.user._id, itemType, itemId });
        await savedItem.save();
        res.status(201).json({ savedItem, message: 'Item saved successfully' });
    } catch (err) {
        next(err);
    }
};

exports.getSavedItems = async (req, res, next) => {
    try {
        const { limit = 20, skip = 0, itemType } = req.query;
        const filter = { user: req.user._id };
        if (itemType) filter.itemType = itemType;

        const savedItems = await SavedItem.find(filter)
            .populate({ path: 'itemId', populate: [{ path: 'author', select: 'username displayName avatarUrl verified' }, { path: 'postedBy', select: 'username displayName avatarUrl verified' }] })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const validSavedItems = savedItems.filter(item => item.itemId != null);
        res.json({ savedItems: validSavedItems, count: validSavedItems.length });
    } catch (err) {
        next(err);
    }
};

exports.unsaveById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const savedItem = await SavedItem.findById(id);
        if (!savedItem) return res.status(404).json({ error: 'Saved item not found' });
        if (savedItem.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Access denied' });
        await savedItem.deleteOne();
        res.json({ message: 'Item unsaved successfully' });
    } catch (err) {
        next(err);
    }
};

exports.unsaveByItem = async (req, res, next) => {
    try {
        const { itemType, itemId } = req.params;
        const savedItem = await SavedItem.findOne({ user: req.user._id, itemType, itemId });
        if (!savedItem) return res.status(404).json({ error: 'Saved item not found' });
        await savedItem.deleteOne();
        res.json({ message: 'Item unsaved successfully' });
    } catch (err) {
        next(err);
    }
};

exports.checkSaved = async (req, res, next) => {
    try {
        const { itemType, itemId } = req.params;
        const savedItem = await SavedItem.findOne({ user: req.user._id, itemType, itemId });
        res.json({ isSaved: !!savedItem });
    } catch (err) {
        next(err);
    }
};
