const { Asset, Portfolio, User } = require('../models');

exports.getMarkets = async (req, res, next) => {
    try {
        // Return a simple list of assets as markets
        const assets = await Asset.find().limit(50).lean();
        // Map to lightweight market objects
        const markets = assets.map(a => ({ id: a._id, title: a.title, description: a.description, value: a.value, verified: a.verified }));
        res.json({ markets });
    } catch (err) {
        next(err);
    }
};

exports.getMyPortfolio = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        const portfolio = await Portfolio.findOne({ owner: req.user._id }).populate('items').lean();
        if (!portfolio) return res.json({ portfolio: { items: [] } });
        res.json({ portfolio });
    } catch (err) {
        next(err);
    }
};

exports.placeOrder = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        const { assetId, side, quantity } = req.body;
        if (!assetId || !['buy', 'sell'].includes(side) || !quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Invalid order payload' });
        }

        const asset = await Asset.findById(assetId);
        if (!asset) return res.status(404).json({ error: 'Asset not found' });

        // Simplified order: update portfolio for buy/sell
        let portfolio = await Portfolio.findOne({ owner: req.user._id });
        if (!portfolio) {
            portfolio = new Portfolio({ owner: req.user._id, items: [] });
        }

        if (side === 'buy') {
            // add asset reference if not present
            if (!portfolio.items.map(String).includes(String(asset._id))) portfolio.items.push(asset._id);
        } else {
            // sell -> remove asset reference (first occurrence)
            portfolio.items = portfolio.items.filter(i => String(i) !== String(asset._id));
        }

        await portfolio.save();

        return res.json({ message: 'order executed', side, asset: { id: asset._id, title: asset.title }, portfolio: { items: portfolio.items } });
    } catch (err) {
        next(err);
    }
};
