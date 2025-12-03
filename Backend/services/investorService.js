const { InvestorDetails } = require('../models');

exports.createInvestor = async (req, res, next) => {
    try {
        const { about, location, investmentFocus, interestedRounds, stage, geography, checkSize } = req.body;
        const existing = await InvestorDetails.findOne({ user: req.user._id });
        if (existing) return res.status(409).json({ error: 'Investor details already exist for this user' });

        const investorDetails = new InvestorDetails({ user: req.user._id, about, location, investmentFocus: investmentFocus || [], interestedRounds: interestedRounds || [], stage, geography: geography || [], checkSize });
        await investorDetails.save();
        res.status(201).json({ investorDetails });
    } catch (err) {
        next(err);
    }
};

exports.getInvestorByUser = async (req, res, next) => {
    try {
        const investorDetails = await InvestorDetails.findOne({ user: req.params.userId }).populate('user', 'username displayName avatarUrl');
        if (!investorDetails) return res.status(404).json({ error: 'Investor details not found' });
        res.json({ investorDetails });
    } catch (err) {
        next(err);
    }
};

exports.updateInvestor = async (req, res, next) => {
    try {
        const investorDetails = await InvestorDetails.findById(req.params.id);
        if (!investorDetails) return res.status(404).json({ error: 'Investor details not found' });
        if (investorDetails.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });

        const allowedFields = ['about', 'location', 'investmentFocus', 'interestedRounds', 'stage', 'geography', 'checkSize'];
        allowedFields.forEach(field => { if (req.body[field] !== undefined) investorDetails[field] = req.body[field]; });
        await investorDetails.save();
        res.json({ investorDetails });
    } catch (err) {
        next(err);
    }
};

exports.listInvestors = async (req, res, next) => {
    try {
        const { limit = 20, skip = 0, focus, round, stage } = req.query;
        const filter = {};
        if (focus) filter.investmentFocus = focus;
        if (round) filter.interestedRounds = round;
        if (stage) filter.stage = stage;

        const investors = await InvestorDetails.find(filter).populate('user', 'username displayName avatarUrl verified').limit(parseInt(limit)).skip(parseInt(skip));
        res.json({ investors, count: investors.length });
    } catch (err) {
        next(err);
    }
};
